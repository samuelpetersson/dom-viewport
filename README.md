# dom-viewport
Measure and notify element regions

### Concept

```javascript
//Get element bounds relative to the viewport
var rect = viewport.elementRect(element);
```

```javascript
//Determine wheter specified rect is visible inside the viewport
var visible = viewport.intersects(rect);
```

```javascript
//Observe element and notify changes to the delegate
var region = viewport.createRegion(delegate, element);
```

### Examples

```javascript
//Implement the delegate with visibillity, position and size
var delegate = {
	regionShow:function(region){
		//Element is visible
	},
	regionHide:function(region){
		//Element is hidden
	},
	regionScroll:function(region){
		//Viewport scrolled and element has new position
	},
	regionResize:function(region){
		//Viewport resized and element has new size
	}
};
//Create a new region for element
var region = viewport.createRegion(delegate, element);

//Log region visibillity
console.log(region.visible);

//Log region bounds
console.log(region.visible);
```

```javascript
//Create a region with 10 pixels padding.
var offset = {x:-10, y:-10, width:20, height:20};
viewport.createRegion(delegate, element, offset);
```
