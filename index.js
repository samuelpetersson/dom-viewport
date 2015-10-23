function Viewport(element) {

};

Viewport.prototype.createRegion = function(delegate, element) {
	return {};
}

Viewport.prototype.update = function() {};

Viewport.prototype.layout = function() {};

Viewport.prototype.notifyRegion = function(region, event) {};

Viewport.prototype.elementRect = function(element) {};

Viewport.prototype.contains = function(rect) {};

module.exports = new Viewport(window);
