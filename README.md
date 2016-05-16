# dom-viewport
Measure and notify element regions inside the viewport (window).

### Concept

```javascript
//Get element bounds relative to the viewport.
var rect = viewport.elementRect(element);
```

```javascript
//Determine wheter specified rect, with the optional inset is visible inside the viewport.
var visible = viewport.intersects(rect, inset);
```

```javascript
//Observe element and notify changes to the delegate.
var region = viewport.createRegion(delegate, element, inset);

//Get region visibility.
region.visible;

//Get region bounds rect.
region.bounds;

//Dispose and stop Observe region.
region.dipose();
```

### Examples

```javascript
//Implement the delegate with visibility, position and size.
var delegate = {
	regionShow:function(region){
		//Element is visible.
	},
	regionHide:function(region){
		//Element is hidden.
	},
	regionScroll:function(region){
		//Wiewport scrolled and element has new position.
	},
	regionResize:function(region){
		//Wiewport resized and element has new size.
	}
};
//Create a new region for element.
var region = viewport.createRegion(delegate, element);
```

```javascript
//Create a region with 10 pixels inset.
var inset = {top:10, right:10, bottom:10, left:10};
var region = viewport.createRegion(delegate, element, inset);
```
