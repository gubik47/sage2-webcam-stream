var filter = {
   	// array of available filters in filter.css
    filters: [
        "", 
        "sepia", 
        "grayscale", 
        "blur", 
        "brightness", 
        "contrast", 
        "hue-rotate", 
        "saturate", 
        "invert"
    ],

    // id of currently applied filter
    filterIdx: 0,

    // inserts a css file to the document with filter definitions
    insertFilters: function() {
        $('head').append('<link rel="stylesheet" href="uploads/apps/webcam_stream/filter.css" type="text/css" />');
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
        $("video.sageItem").attr("class", "sageItem " + this.filters[this.filterIdx]);
    },	
} 