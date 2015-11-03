function Viewport() {
	this.regions = [];
	this.update();

	var self = this;

	this.handler = function() {
		self.update();
		self.layout();
	};

	if(window.addEventListener) {
		window.addEventListener("scroll", this.handler);
		window.addEventListener("resize", this.handler);
	}
	else if(window.attachEvent) {
		window.attachEvent("onscroll", this.handler);
		window.attachEvent("onresize", this.handler);
	}
}

Viewport.prototype.createRegion = function(delegate, element){
	var region = {delegate:delegate, element:element};
	region.bounds = this.elementRect(region.element);
	region.visible = this.contains(region.bounds);
	this.regions.push(region);
	return region;
};

Viewport.prototype.notifyRegion = function(region, event) {
	var scope = region.delegate;
	if(scope[event]) {
		scope[event](region);
	}
};

Viewport.prototype.update = function() {
	var w = window, d = document, e = d.documentElement, b = d.body;
	this.x = w.pageXOffset || e && e.scrollLeft || b && b.scrollLeft || 0;
	this.y = w.pageYOffset || e && e.scrollTop || b && b.scrollTop || 0;
	this.width = w.innerWidth || e && e.clientWidth || b && b.clientWidth;
	this.height = w.innerHeight || e && e.clientHeight || b && b.clientHeight;
};

Viewport.prototype.layout = function() {
	var regions = this.regions, length = regions.length, i = 0, region;

	while(i < length) {
		region = regions[i];
		if(region.disposed) {
			regions.splice(i, 1);
			length--;
		}
		else {
			var oldRect = region.bounds;
			var oldVisible = region.visible;
			var newRect = this.elementRect(region.element);
			var newVisible = this.contains(newRect);
			region.visible = newVisible;
			region.bounds = newRect;

			if(newVisible) {
				if(!oldVisible) {
					this.notifyRegion(region, "regionDidShow");
				}
				if(newRect.x !== oldRect.x || newRect.y !== oldRect.y) {
					this.notifyRegion(region, "regionDidScroll");
				}
				if(newRect.width !== oldRect.width || newRect.height !== oldRect.height) {
					this.notifyRegion(region, "regionDidResize");
				}
			}
			else {
				if(oldVisible) {
					this.notifyRegion(region, "regionDidHide");
				}
			}
			i++;
		}
	}
};

Viewport.prototype.contains = function(rect) {
	if(rect.x > this.width) {
		return false;
	}
	if(rect.x + rect.width < 0) {
		return false;
	}
	if(rect.y > this.height) {
		return false;
	}
	if(rect.y + rect.height < 0) {
		return false;
	}
	return true;
};

Viewport.prototype.elementRect = function(element, inset) {
	var bounds = element.getBoundingClientRect();
	return {x:bounds.left, y:bounds.top, width:element.clientWidth, height:element.clientHeight};
};

if(module) {
	module.exports = new Viewport();
}
