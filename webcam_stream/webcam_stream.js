// SAGE2 is available for use under the SAGE2 Software License
//
// University of Illinois at Chicago"s Electronic Visualization Laboratory (EVL)
// and University of Hawai"i at Manoa"s Laboratory for Advanced Visualization and
// Applications (LAVA)
//
// See full text, terms and conditions in the LICENSE.txt included file
//
// Copyright (c) 2014

// fix for JavaScript weird modulo computation with negative numbers
function mod(n, m) {
    return ((n % m) + m) % m;
}

var webcam_stream = SAGE2_App.extend( {
    construct: function() {
        // call the constructor of the base class
        arguments.callee.superClass.construct.call(this);

        this.resizeEvents = "continuous";//see below for other options
        this.enableControls = true;

        // feature check variable for getUserMedia availability
        navigator.getUserMedia = navigator.getUserMedia ||
                                 navigator.webkitGetUserMedia ||
                                 navigator.mozGetUserMedia;
        // video capture constraints
        this.constraints = {
            "audio": false,
            "video": {
                "mandatory": {
                    "minWidth": "1280",
                    "minHeight": "720",
                    "maxWidth": "1280",
                    "maxHeight": "720"
                },
                "optional": []
            }
        };
        // holds the video element
        this.video = null;
        // holds the stream object
        this.localMediaStream = null;
        // indicates whether the stream is paused
        this.isStreamPaused = false;
        // array of available filters in filter.css
        this.filters = [
            "", 
            "sepia", 
            "grayscale", 
            "blur", 
            "brightness", 
            "contrast", 
            "hue-rotate", 
            "saturate", 
            "invert"
        ];

        // id of currently applied filter
        this.filterIdx = 0;
    },

    // inserts a css file to the document with filter definitions
    insertFilters: function() {
        var css = document.createElement("link")
        css.setAttribute("rel", "stylesheet")
        css.setAttribute("type", "text/css")
        css.setAttribute("href", "uploads/apps/webcam_stream/filter.css")
        document.getElementsByTagName("head")[0].appendChild(css)
    },

    // removes a css file to the document with filter definitions
    removeFilters: function() {
        document.querySelector("link[href~=\"filters.css\"]").remove();
    },

    // applies next or previous filter in array to the stream
    // option fw: next, bw: previous
    applyFilter: function(option) {
        if (option === "fw") {
            // move forwards in array of filters
            this.filterIdx = mod(this.filterIdx + 1, this.filters.length);
        } else if (option === "bw") {
            // move backwards in array of filters
            this.filterIdx = mod(this.filterIdx - 1, this.filters.length);
        } else {
            // remove any filter
            this.filterIdx = 0;
        }
        this.video.className = "sageItem " + this.filters[this.filterIdx];
    },

    init: function(id, width, height, resrc, date) {    
        // data: contains initialization parameters, such as `x`, `y`, `width`, `height`, and `date` 
        // call super-class "init"

        arguments.callee.superClass.init.call(this, id, "video", width, height, resrc, date);

        // insert css file with video filters
        this.insertFilters();

        // start webcam stream
        this.startStream();

        /*this.controls.addTextInput({action: function(text) {
            console.log("HXX");
        }});*/

        this.controls.finishedAddingControls(); // Important;
    },

    pauseStream: function() {
        this.video.pause();
    },

    resumeStream: function() {
        this.video.play();
    },

    startStream: function() {
        // contains the app object itself
        var self = this;

        //console.log(this);

        if (navigator.getUserMedia) {
            navigator.getUserMedia(this.constraints,
                function(stream) {
                    self.video = document.querySelector("#" + self.div.id + " video");
                    self.video.src = window.URL.createObjectURL(stream);
                    self.video.onloadedmetadata = function(e) {
                        this.play();
                    };
                    self.localMediaStream = stream;
                },
                function(err) {
                    self.log("The following error occured: " + err.name);
                }
            );
        } else {
            this.log("getUserMedia not supported.");
        }
        this.log("Webcam stream started.");
    },

    //load function allows application to begin with a particular state.  Needed for remote site collaboration. 
    load: function(state, date) {
        //your load code here- state should define the initial/current state of the application
    },

    draw: function(date) {
    },

    resize: function(date) {
        // to do:  may be a super class resize
        // or your resize code here
        //this.refresh(date); //redraw after resize
    },

    event: function(type, position, user, data, date) {
        if (type === "keyboard") {
            switch (data.character) {
                case "p": {
                    if (this.isStreamPaused == false) {
                        this.log("Stream paused.");
                        this.pauseStream();
                        this.isStreamPaused = true;
                    } else {
                        this.log("Stream resumed.");
                        this.resumeStream();
                        this.isStreamPaused = false;
                    }
                    break;
                }
                case "a": {
                    this.applyFilter("fw");
                    break;
                }
                case "d": {
                    this.applyFilter("bw");
                    break;
                }
                case "r": {
                    this.applyFilter("reset");
                    break;
                }
                case "w": {
                    //increment();
                    console.log("Increment.");
                    break;
                }
                case "s": {
                    //decrement();
                    console.log("Decrement");
                    break;
                }
                default: {
                    this.log("Unknown key pressed.");
                    break;
                }
            }
        }
        // may need to redraw 
        //this.refresh(date);
    },

    move: function(date) {
        // this.sage2_x, this.sage2_y give x,y position of upper left corner of app in global wall coordinates
                // this.sage2_width, this.sage2_height give width and height of app in global wall coordinates
                // date: when it happened
        
        //this.refresh(date);
    },

    quit: function() {
        // release webcam hardware
        this.localMediaStream.stop();
        this.video.src = "";
        this.log("Webcam stream terminated.");
    }
});