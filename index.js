var viewport = (function(){
	var self = {};

	var elementRect = function(element, offset) {
		var x = 0, y = 0, w, h;
		if(element === window) {
			w = self.width;
			h = self.height;
		}
		else {
			if(element === document) {
				element = document.body;
			}
			var bounds = element.getBoundingClientRect();
			x = bounds.left;
			y = bounds.top;
			w = element.clientWidth;
			h = element.clientHeight;
		}
		if(offset) {
			x += offset.x || 0;
			y += offset.y || 0;
			w += offset.width || 0;
			h += offset.height || 0;
		}
		return {x:x, y:y, width:w, height:h};
	};

	var intersects = function(rect) {
		if(rect.x > self.width) {
			return false;
		}
		if(rect.x + rect.width < 0) {
			return false;
		}
		if(rect.y > self.height) {
			return false;
		}
		if(rect.y + rect.height < 0) {
			return false;
		}
		return true;
	};

	var regions = [];

	var update = function(){
		var w = window, d = document, e = d.documentElement, b = d.body;
		self.x = w.pageXOffset || e && e.scrollLeft || b && b.scrollLeft || 0;
		self.y = w.pageYOffset || e && e.scrollTop || b && b.scrollTop || 0;
		self.width = w.innerWidth || e && e.clientWidth || b && b.clientWidth;
		self.height = w.innerHeight || e && e.clientHeight || b && b.clientHeight;

		var length = regions.length, i = 0, region;
		while(i < length) {
			region = regions[i];
			if(region.disposed) {
				regions.splice(i, 1);
				length--;
			}
			else {
				region.validate();
				i++;
			}
		}
	};

	if(window.addEventListener) {
		window.addEventListener("scroll", update);
		window.addEventListener("resize", update);
	}
	else if(window.attachEvent) {
		window.attachEvent("onscroll", update);
		window.attachEvent("onresize", update);
	}

	update();

	function Region(delegate, element, offset) {
		this.delegate = delegate;
		this.element = element;
		this.offset = offset;
		this.bounds = elementRect(this.element, this.offset);
		this.visible = this.bounds.width > 0 && this.bounds.height > 0 && intersects(this.bounds);
	}

	Region.prototype.validate = function() {
		var oldRect = this.bounds;
		var oldVisible = this.visible;
		var newRect = elementRect(this.element, this.offset);
		var newVisible = newRect.width > 0 && newRect.height > 0 && intersects(newRect);
		this.visible = newVisible;
		this.bounds = newRect;

		if(newVisible) {
			if(!oldVisible) {
				this.notify("regionShow");
			}
			if(newRect.x !== oldRect.x || newRect.y !== oldRect.y) {
				this.notify("regionScroll");
			}
			if(newRect.width !== oldRect.width || newRect.height !== oldRect.height) {
				this.notify("regionResize");
			}
		}
		else {
			if(oldVisible) {
				this.notify("regionHide");
			}
		}
	};

	Region.prototype.notify = function(event) {
		var scope = this.delegate;
		if(scope[event]) {
			scope[event](this);
		}
	};

	self.intersects = intersects;
	self.elementRect = elementRect;
	self.createRegion = function(delegate, element, offset) {
		var region = new Region(delegate, element, offset);
		regions.push(region);
		return region;
	};

	return self;
})();

if(typeof module !== "undefined") {
	module.exports = viewport;
}
