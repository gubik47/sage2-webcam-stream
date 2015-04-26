// SAGE2 is available for use under the SAGE2 Software License
//
// University of Illinois at Chicago"s Electronic Visualization Laboratory (EVL)
// and University of Hawai"i at Manoa"s Laboratory for Advanced Visualization and
// Applications (LAVA)
//
// See full text, terms and conditions in the LICENSE.txt included file
//
// Copyright (c) 2014

var webcam_stream = SAGE2_App.extend( {
    construct: function() {
        // call the constructor of the base class
        arguments.callee.superClass.construct.call(this);

        this.resizeEvents = "continuous";

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
    },

    init: function(id, width, height, resrc, date) {    
        arguments.callee.superClass.init.call(this, id, "video", width, height, resrc, date);

        // insert css file with default filter values
        filterObj.insertFilterCss();

        // start webcam stream
        this.startStream();
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

        // init video stream with getUserMedia API
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
    },

    draw: function(date) {
    },

    resize: function(date) {
    },

    event: function(type, position, user, data, date) {
        if (type === "keyboard") {
            switch (data.character) {
                case "p": {
                    // pause (freeze) the stream, if already paused resume stream
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
                    // cycle backwards through araay of available filters
                    filterObj.applyFilter("bw");
                    this.log("Active filter: " + filterObj.filters[filterObj.activeFilterId].name);
                    break;
                }
                case "d": {
                    // cycle forwards through araay of available filters
                    filterObj.applyFilter("fw");
                    this.log("Active filter: " + filterObj.filters[filterObj.activeFilterId].name);
                    break;
                }
                case "r": {
                    // reset, removes any applied filter
                    filterObj.applyFilter("reset");
                    this.log("Active filter: " + filterObj.filters[filterObj.activeFilterId].name);
                    break;
                }
                case "w": {
                    // increments the value of currently applied filter by set amount
                    filterObj.adjustFilter("fw");
                    break;
                }
                case "s": {
                    // decrements the value of currently applied filter by set amount
                    filterObj.adjustFilter("bw");
                    break;
                }
                default: {
                    this.log("Unknown key pressed.");
                    break;
                }
            }
        }
    },

    move: function(date) {
    },

    quit: function() {
        // release webcam hardware
        this.localMediaStream.stop();
        this.video.src = "";
        this.log("Webcam stream terminated.");
    }
});