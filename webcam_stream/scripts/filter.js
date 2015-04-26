// fix for JavaScript weird modulo computation with negative numbers
function mod(n, m) {
    return ((n % m) + m) % m;
}

/* Filter obj constructor
 * @param name, filter name
 * @param min, minimal value of the filter
 * @param max, maximal value of the filter
 * @param inc, amount to increment/decrement
 * @param unit, filter value unit
*/
function Filter(name, min, max, inc, unit) {
	this.name = name;
	this.min = min;
	this.max = max;
	this.inc = inc;
	this.unit = unit
}

var filterObj = {
   	// array of available filters specified in filter.css
    filters: [
        new Filter("normal", 0, 0, false, ""),
        new Filter("sepia", 0, 1.0, 0.1, ""),
        new Filter("grayscale", 0, 1.0, 0.1, ""),
        new Filter("blur", 0, 30, 1, "px"),
        new Filter("brightness", 0, 5.0, 0.1, ""),
        new Filter("contrast", 0, 10, 0.1, ""),
        new Filter("hue-rotate", 0, 360, 3, "deg"), 
        new Filter("saturate", 0, 10, 0.1, ""), 
        new Filter("invert", 0, 1.0, 0.1, "")
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
        // remove previous applied filter
        $("video.sageItem").attr("style","");

        if (option === "fw") {
            // cycle forwards through araay of available filters
            this.activeFilterId = mod(this.activeFilterId + 1, this.filters.length);
        } else if (option === "bw") {
            // cycle backwards through araay of available filters
            this.activeFilterId = mod(this.activeFilterId - 1, this.filters.length);
        } else if (option === "reset") {
            // remove any applied filter
            this.activeFilterId = 0;
        } else {
            // invalid value
            return false;
        }

        // apply new filter
        $("video.sageItem").attr("class", "sageItem " + this.filters[this.activeFilterId].name);
    },

    // increments/decrements value of currently applied filter
    adjustFilter: function(option) {
        // check if filter can be adjusted
    	if (this.filters[this.activeFilterId].inc) {
            // get current filter value
            var currentFilterValue = $("video.sageItem").css("-webkit-filter").match(/\d+\.?\d*/)[0];
            //console.log(currentFilterValue);
    		if (option === "fw") {
                var newFilterValue = parseFloat(currentFilterValue) + this.filters[this.activeFilterId].inc;
                // if  the new value is higher than maximal value, set it to maximal
                if (newFilterValue > this.filters[this.activeFilterId].max) {
                    newFilterValue = this.filters[this.activeFilterId].max;
                }
                newFilterValue = this.filters[this.activeFilterId].name + "(" + newFilterValue + this.filters[this.activeFilterId].unit + ")"
                webcamApp.log(newFilterValue);
                // set new higher filter value
                $("video.sageItem").css("-webkit-filter", newFilterValue);
    		} else if (option === "bw") {
    			var newFilterValue = parseFloat(currentFilterValue) - this.filters[this.activeFilterId].inc;
                // if  the new value is lower than minimal value, set it to minimal
                if (newFilterValue < this.filters[this.activeFilterId].min) {
                    newFilterValue = this.filters[this.activeFilterId].min;
                }
                newFilterValue = this.filters[this.activeFilterId].name + "(" +  newFilterValue + this.filters[this.activeFilterId].unit + ")"
    		    webcamApp.log(newFilterValue);
                // set new lower filter value
                $("video.sageItem").css("-webkit-filter", newFilterValue);
            }
    	}
    }	
} 