

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gfx === "undefined"){ JSL.gfx = {}; }

JSL.gfx.View = function(dom, context, config){
	iblokz.Element.call(this, dom, context);

	this._config = config || {};

	this._position = config.position;

	this._elements = [];

	this._layers = {
		grid: new JSL.gfx.Grid($(this._dom).find("canvas.grid")[0], this._config),
		elements: new JSL.gfx.Canvas($(this._dom).find("canvas.elements")[0]),
		interaction: new JSL.gfx.Canvas($(this._dom).find("canvas.interaction")[0])
	}
}

JSL.gfx.View.prototype = Object.create( iblokz.Element.prototype );
JSL.gfx.View.prototype.constructor = JSL.gfx.View;

JSL.gfx.View.prototype.init = function() {

	this._layers.grid.init();
	this._layers.elements.init();
	this._layers.interaction.init();

	// grid
	var grid = this._layers.grid;
	var conf = this._config;
	$(this._dom).on('mousewheel', function(event) {

		var range = _.cloneDeep(conf.range);
		
		range.y.start = grid._multiAdd(range.y.start,grid._visible.y,range.y.length);
		range.x.end = grid._multiSubtract(range.x.end,grid._visible.x,range.x.length);
		//console.log(event.originalEvent.deltaX, event.originalEvent.deltaY, event.originalEvent.deltaFactor);
		var modified = false;
		if(event.originalEvent.deltaY != 0){
			var direction = (event.originalEvent.deltaY > 0) ? range.y.direction : -range.y.direction;
			grid._position.y = grid._multiIterate(grid._position.y, grid._position.y.length-1, range.y, direction);
			modified = true;
		}

		if(event.originalEvent.deltaX != 0){
			var direction = (event.originalEvent.deltaX > 0) ? range.x.direction : -range.x.direction;
			grid._position.x = grid._multiIterate(grid._position.x, grid._position.x.length-1, range.x, direction);
			modified = true;
		}

		if(modified){
			grid.refresh();
			this._position = grid._position;
			//console.log(grid._position.x);
		}

	});

	// interaction
	var interaction = this._layers.interaction;

	var startPos = [0,0];
	var currentPos = [0,0];
	var selecting = false;

	$(this._dom).on('mousedown', function(event) {
		selecting = true;
		startPos = [event.offsetX, event.offsetY];
	})

	$(this._dom).on('mousemove', function(event) {
		if(selecting == true){
			currentPos = [event.offsetX-startPos[0], event.offsetY-startPos[1]];
			interaction.clear();
			interaction.rect(startPos, currentPos, false,"#fff", [7,5]);
		}
	})

	$(this._dom).on('mouseup', function(event) {
		selecting = false;
		startPos = [0, 0];
		currentPos = [0, 0];
		interaction.clear();
	})

}

JSL.gfx.View.prototype.addElement = function(element){
	this._layers.grid.addElement(element);
}

JSL.gfx.View.prototype.refresh = function(){

}