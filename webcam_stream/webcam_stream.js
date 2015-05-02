// SAGE2 is available for use under the SAGE2 Software License
//
// University of Illinois at Chicago's Electronic Visualization Laboratory (EVL)
// and University of Hawai'i at Manoa's Laboratory for Advanced Visualization and
// Applications (LAVA)
//
// See full text, terms and conditions in the LICENSE.txt included file
//
// Copyright (c) 2014

var webcamApp;

var webcam_stream = SAGE2_App.extend( {
    construct: function() {
        // call the constructor of the base class
        arguments.callee.superClass.construct.call(this);

        this.resizeEvents = "continuous";

        // Need to set this to true in order to tell SAGE2 that you will be needing widget controls for this app
        this.enableControls = true;

        // feature check variable for getUserMedia availability
        navigator.getUserMedia = navigator.getUserMedia ||
                                 navigator.webkitGetUserMedia ||
                                 navigator.mozGetUserMedia;
        // video capture constraints
        this.constraints = {
            audio: false,
            video: {
                mandatory: {
                    minAspectRatio: 1.777, 
                    maxAspectRatio: 1.778,
                    maxWidth: 320,
                    maxHeight: 180,
                    maxFrameRate: 30            
                },
                optional: [
                ]
            }
        };
        // holds the video element
        this.video = null;
        // holds the stream object
        this.localMediaStream = null;
        // indicates whether the stream is paused
        this.isStreamPaused = false;
        // global app handler
        webcamApp = this;

        this.maxFPS = 60.0;
    },

    init: function(data) {    
        arguments.callee.superClass.init.call(this, "video", data);

        // insert css file with default filter values
        filterObj.insertFilterCss();

        // start webcam stream
        this.startStream();

        console.log(
            "Controls:\n" +
            "\t P - Pause/resume stream \n" +
            "\t A/D - Cycle through available filters \n" +
            "\t W - Increase value of currently applied filter \n" +
            "\t S - Decrease value of currently applied filter \n" +
            "\t R - Remove any applied filter"
        );


        this.controls.addButtonType("480p", _480pButton);
        this.controls.addButtonType("720p", _720pButton);
        this.controls.addButtonType("1080p", _1080pButton);
        this.controls.addButtonType("10fps", _10fpsButton);
        this.controls.addButtonType("20fps", _20fpsButton);
        this.controls.addButtonType("30fps", _30fpsButton);
        this.controls.addButtonType("60fps", _60fpsButton);
        this.controls.addButtonType("reset", resetButton);

        this.controls.addButton({type:"10fps", sequenceNo: 19, action: function(date) {
            this.setFPS(10);
        }.bind(this)});

        this.controls.addButton({type:"20fps", sequenceNo: 18, action: function(date) {
            this.setFPS(20);
        }.bind(this)});

        this.controls.addButton({type:"30fps", sequenceNo: 17, action: function(date) {
            this.setFPS(30);
        }.bind(this)});

        this.controls.addButton({type:"60fps", sequenceNo: 16, action: function(date) {
            this.setFPS(60);
        }.bind(this)});

        this.controls.addButton({type:"480p", sequenceNo: 15, action: function(date) {
            this.setResolution(640, 480);
        }.bind(this)});

        this.controls.addButton({type:"720p", sequenceNo: 14, action: function(date) {
            this.setResolution(1280, 720);
        }.bind(this)});

        this.controls.addButton({type:"1080p", sequenceNo: 13, action: function(date) {
            this.setResolution(1920, 1080);
        }.bind(this)});        

        this.controls.addButton({type:"next", sequenceNo: 12, action: function(date) {
            filterObj.applyFilter("fw");           
        }.bind(this)});

        this.controls.addButton({type:"prev", sequenceNo: 11, action: function(date) {
            filterObj.applyFilter("bw");           
        }.bind(this)});

        this.controls.addButton({type:"up-arrow", sequenceNo: 10, action: function(date) {
            filterObj.adjustFilter("fw");
        }.bind(this)});

        this.controls.addButton({type:"down-arrow", sequenceNo: 9, action: function(date) {
            filterObj.adjustFilter("bw");
        }.bind(this)});

        this.controls.addButton({type:"reset", sequenceNo: 8, action: function(date) {
            filterObj.applyFilter("reset");
        }.bind(this)});

        this.controls.finishedAddingControls(); // Important
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

        if (!!this.localMediaStream) {
            this.video.src = null;
            this.localMediaStream.stop();
        }

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
                    console.log(err);
                }
            );
        } else {
            this.log("getUserMedia not supported.");
        }
        this.log("Webcam stream started.");
    },

    // sets new video resolution
    setResolution: function(width, height) {
        this.log("Resolution: " + height + "p");
        this.constraints.video.mandatory.maxWidth = width;
        this.constraints.video.mandatory.maxHeight = height;
        this.startStream();
    },

    setFPS: function(fps) {
        this.log("FPS: " + fps);
        this.constraints.video.mandatory.maxFrameRate = fps;
        this.startStream();
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
                    break;
                }
                case "d": {
                    // cycle forwards through araay of available filters
                    filterObj.applyFilter("fw");                   
                    break;
                }
                case "r": {
                    // reset, removes any applied filter
                    filterObj.applyFilter("reset");                   
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