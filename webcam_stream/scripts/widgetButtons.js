function SimpleWidgetButton(label) {
    this.textual = true;
    this.label = label;
    this.fill = "rgba(250,250,250,1.0)";
    this.animation = false;
}

var _480pButton = new SimpleWidgetButton("480p");

var _720pButton = new SimpleWidgetButton("720p");

var _1080pButton = new SimpleWidgetButton("1080p");

var _10fpsButton = new SimpleWidgetButton("10fps");

var _20fpsButton = new SimpleWidgetButton("20fps");

var _30fpsButton = new SimpleWidgetButton("30fps");

var _60fpsButton = new SimpleWidgetButton("60fps");

var resetButton = new SimpleWidgetButton("Reset");