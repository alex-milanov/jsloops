

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
	};

	this.signals = {
		create:  new JSL.etc.Signal()
	};


	this.layers = {
		grid: new JSL.gfx.Grid(this.find("canvas.grid")[0], this.config),
		elements: new JSL.gfx.Canvas(this.find("canvas.elements")[0]),
		interaction: new JSL.gfx.Canvas(this.find("canvas.interaction")[0])
	};
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
		view.interaction.start.set(event.offsetX, event.offsetY);
		// determine the action
		var elementIndex = false;
		var edgeDistance = 0;
		grid.hitAreas.forEach(function(hitArea){
			if(hitArea.rect.contains(view.interaction.start)){
				elementIndex = hitArea.elementIndex;
				edgeDistance = hitArea.rect.x + hitArea.rect.width - view.interaction.start.x;
			}
		});

		if(view.data["int-mode"] !== "delete" && elementIndex !== false && grid.selection.indexOf(elementIndex) === -1){
			grid.selection = [elementIndex];
			grid.refresh();
		}

		switch(view.data["int-mode"]){
			case "select":
				if(elementIndex !== false){
					view.interaction.action = "moving";
				} else {
					view.interaction.action = "selecting";
				}
				break;
			case "edit":
				if(elementIndex !== false){
					if(edgeDistance < grid.conf.step.x/4){
						view.interaction.action = "resizing";
					} else {
						view.interaction.action = "moving";
					}
				} else {
					view.interaction.action = "creating";
				}
				break;
			case "delete":
				if(elementIndex !== false){
					view.interaction.action = "deleting";
				}
				break;
		}

		view.interaction.last.copy(view.interaction.start);
	})

	this.on('mousemove', function(event) {
		if(["mousedown","mousemove"].indexOf(view.interaction.status)>-1){
			view.interaction.status = "mousemove";
			var currentPos = new JSL.gfx.Vector2(event.offsetX, event.offsetY);
			var changeVector = currentPos.clone().sub(view.interaction.start);

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
					view.interaction.last = currentPos.clone();
					break;
				case "moving":
					var changeSinceLast = currentPos.clone().sub(view.interaction.last);
					var xSteps = parseInt(Math.abs(changeSinceLast.x)/grid.conf.step.x);
					var ySteps = parseInt(Math.abs(changeSinceLast.y)/grid.conf.step.y);
					if(xSteps != 0 || ySteps != 0){
						
						grid.selection.forEach(function(elementIndex){
							grid.elements[elementIndex].counter.x.iterate(xSteps, changeSinceLast.x/Math.abs(changeSinceLast.x));
							grid.elements[elementIndex].counter.y.iterate(ySteps, changeSinceLast.y/Math.abs(changeSinceLast.y));
							grid.elements[elementIndex].update();
						})
						grid.refresh();
						view.interaction.last.add(new JSL.gfx.Vector2(
							parseInt(changeSinceLast.x/grid.conf.step.x)*grid.conf.step.x,
							parseInt(changeSinceLast.y/grid.conf.step.y)*grid.conf.step.y
						));
					}
					break;
				case "resizing":
					var changeSinceLast = currentPos.clone().sub(view.interaction.last);
					var xSteps = parseInt(Math.abs(changeSinceLast.x)/grid.conf.step.x);
					if(xSteps != 0 ){
						grid.selection.forEach(function(elementIndex){
							grid.elements[elementIndex].length.iterate(xSteps, changeSinceLast.x/Math.abs(changeSinceLast.x));
							grid.elements[elementIndex].update();
						})
						grid.refresh();
						view.interaction.last.add(new JSL.gfx.Vector2(
							parseInt(changeSinceLast.x/grid.conf.step.x)*grid.conf.step.x,
							parseInt(changeSinceLast.y/grid.conf.step.y)*grid.conf.step.y
						));
					}
					break;
				default:
					view.interaction.last = currentPos.clone();
					break;
			}
		}
	})

	this.on('mouseup', function(event) {
		//console.log(grid.selection.length, view.interaction.status);

		switch(view.interaction.action){
			case "selecting":
				if(grid.selection.length == 0 || view.interaction.status == "mousedown"){
					grid.selection = [];
					var currentPos = new JSL.gfx.Vector2(event.offsetX, event.offsetY);
					grid.hitAreas.forEach(function(hitArea){
						if(hitArea.rect.contains(currentPos)) {
							grid.selection.push(hitArea.elementIndex);
						}
					});
					grid.refresh();
				}
				break;
			case "creating":

				var xSteps = parseInt(Math.abs(view.interaction.last.x)/grid.conf.step.x);
				var ySteps = parseInt(Math.abs(view.interaction.last.y)/grid.conf.step.y);

				xSteps = (xSteps > 0) ? xSteps-1 : xSteps;

				var counter = {
					x: grid.counter.x.clone().iterate(xSteps),
					y: grid.counter.y.clone().iterate(ySteps)
				}

				view.signals.create.dispatch(counter);

				break;
			case "deleting":
				grid.hitAreas.forEach(function(hitArea){
					if(hitArea.rect.contains(view.interaction.start)) {
						grid.elements[hitArea.elementIndex].remove();
					}
				});
				break;
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
	this.layers.grid.refresh();
}
