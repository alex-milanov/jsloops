

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gfx === "undefined"){ JSL.gfx = {}; }

JSL.gfx.View = function(dom, config){
	iblokz.Element.call(this, dom);

	this.config = config || {};

	this.position = config.position;

	this.elements = [];

	this.data = {
		"int-mode": "select"
	};

	this.interaction = {
		status: "idle",
		action: "none", // selecting, moving, resizing
		start: new JSL.gfx.Vector2(0,0),
		last: new JSL.gfx.Vector2(0,0)
	}


	this.layers = {
		grid: new JSL.gfx.Grid(this.find("canvas.grid")[0], this.config),
		elements: new JSL.gfx.Canvas(this.find("canvas.elements")[0]),
		interaction: new JSL.gfx.Canvas(this.find("canvas.interaction")[0])
	}
}

JSL.gfx.View.prototype = Object.create( iblokz.Element.prototype );
JSL.gfx.View.prototype.constructor = JSL.gfx.View;

JSL.gfx.View.prototype.init = function() {

	this.layers.grid.init();
	this.layers.elements.init();
	this.layers.interaction.init();

	var view = this;

	// grid
	var grid = this.layers.grid;
	var conf = this.config;


	this.on('mousewheel', function(event) {

		var panVector = new JSL.gfx.Vector2(0,0);

		if(event.deltaY != 0){
			panVector.y = (event.deltaY > 0) ? 1 : -1;
		}

		if(event.deltaX != 0){
			panVector.x = (event.deltaX > 0) ? 1 : -1;
		}

		grid.pan(panVector);

	});

	// interaction
	var interactionLayer = this.layers.interaction;

	this.on('mousedown', function(event) {
		view.interaction.status = "mousedown";
		view.interaction.action = "selecting"; // TODO: moving when the start is inside a selected hitArea
		view.interaction.start.set(event.offsetX, event.offsetY);
		view.interaction.last.set(0, 0);
	})

	this.on('mousemove', function(event) {
		if(["mousedown","mousemove"].indexOf(view.interaction.status)>-1){
			view.interaction.status = "mousemove";
			var currentPos = new JSL.gfx.Vector2(event.offsetX, event.offsetY);
			var changeVector = currentPos.clone().sub(view.interaction.start);

			view.interaction.last = changeVector;
			switch(view.interaction.action){
				/* when selecting */
				case "selecting":
					var selectionRect = new JSL.gfx.Rect().fromVectors(view.interaction.start, currentPos);
					view.dom.style.cursor = "crosshair";
					interactionLayer.clear();
					interactionLayer.rect(selectionRect, false,"#fff", [7,5]);
					grid.selection = [];
					
					grid.hitAreas.forEach(function(hitArea){
						if(selectionRect.contains(hitArea.rect)){
							grid.selection.push(hitArea.elementIndex);
						}
					});
					grid.refresh();
					break;
				case "moving":
					break;
			}
		}
	})

	this.on('mouseup', function(event) {
		
		if(grid.selection.length == 0){
			var currentPos = new JSL.gfx.Vector2(event.offsetX, event.offsetY);
			grid.hitAreas.forEach(function(hitArea){
				if(hitArea.rect.contains(currentPos)) {
					grid.selection.push(hitArea.elementIndex);
				}
			});
			grid.refresh();
		}
		
		view.interaction = {
			status: "idle",
			action: "none",
			start: new JSL.gfx.Vector2(0,0),
			last: new JSL.gfx.Vector2(0,0)
		}
		interactionLayer.clear();
		view.dom.style.cursor = "inherit";
		
	})

}

JSL.gfx.View.prototype.addElement = function(element){
	this.layers.grid.addElement(element);
}

JSL.gfx.View.prototype.refresh = function(){

}