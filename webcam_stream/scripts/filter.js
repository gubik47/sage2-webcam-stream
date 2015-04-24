// fix for JavaScript weird modulo computation with negative numbers
function mod(n, m) {
    return ((n % m) + m) % m;
}

function Filter(name, min, max, inc, unit) {
	this.name = name;
	this.min = min;
	this.max = max;
	this.inc = inc;
	this.unit = unit
}

var filterObj = {
   	// array of available filters in filter.css
    filters: [
        new Filter("normal", 0, 0, false, ""),
        new Filter("sepia", 0, 1, 0.1, ""),
        new Filter("grayscale", 0, 100, 0.1, ""),
        new Filter("blur", 0, 20, 1, "px"),
        new Filter("brightness", 0, 1, 0.1, ""),
        new Filter("contrast", 0, 8, 0.1, ""),
        new Filter("hue-rotate", 0, 360, 5, "deg"), 
        new Filter("saturate", 0, 10, 0.1, ""), 
        new Filter("invert", 0, 1, 0.1, "")
    ],

    // id of currently applied filter
    activeFilterId: 0,

    // inserts a css file to the document with filter definitions
    insertFilterCss: function() {
        $('head').append('<link rel="stylesheet" href="uploads/apps/webcam_stream/filter.css" type="text/css" />');
    },

    // applies next or previous filter in array to the stream
    // option fw: next, bw: previous
    applyFilter: function(option) {
        $("video.sageItem").attr("style","");  
        if (option === "fw") {
            // move forwards in array of filters
            this.activeFilterId = mod(this.activeFilterId + 1, this.filters.length);
        } else if (option === "bw") {
            // move backwards in array of filters
            this.activeFilterId = mod(this.activeFilterId - 1, this.filters.length);
        } else {
            // remove any filter
            this.activeFilterId = 0;
        }
        $("video.sageItem").attr("class", "sageItem " + this.filters[this.activeFilterId].name);
    },

    adjustFilter: function(option) {
    	if (this.filters[this.activeFilterId].inc) {
            var currentFilterValue = $("video.sageItem").css("-webkit-filter").match(/\d+\.?\d*/)[0];
            console.log(currentFilterValue);
    		if (option === "fw") {
                var newFilterValue = this.filters[this.activeFilterId].name + "(" + (parseFloat(currentFilterValue) + this.filters[this.activeFilterId].inc) + this.filters[this.activeFilterId].unit + ")";
                console.log(newFilterValue);
                $("video.sageItem").css("-webkit-filter", newFilterValue);
    		} else if (option === "bw") {
    			var newFilterValue = this.filters[this.activeFilterId].name + "(" + (parseFloat(currentFilterValue) - this.filters[this.activeFilterId].inc) + this.filters[this.activeFilterId].unit + ")";
    		    console.log(newFilterValue);
                $("video.sageItem").css("-webkit-filter", newFilterValue);
            }
    	}
    }	
} 