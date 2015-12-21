"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gfx === "undefined"){ JSL.gfx = {}; }


JSL.gfx.Grid = function(dom, conf){
	JSL.gfx.Canvas.call(this, dom);

	this.conf = conf;
	var range = conf.range;
	var position = conf.position;

	this.step = new JSL.gfx.Vector2().copy(conf.step);

	this.counter = {
		x: new JSL.etc.Counter(range.x.length, [range.x.start,range.x.end], range.x.direction, position.x),
		y: new JSL.etc.Counter(range.y.length, [range.y.start,range.y.end], range.y.direction, position.y)
	}

	this.playHead = this.counter.x.clone();

	this.offset = new JSL.gfx.Vector2(
		this.counter.x.toSteps()*conf.step.x,
		this.counter.y.toSteps()*conf.step.y
	);

	this.range = new JSL.gfx.Rect();

	this.range.setStart({
		x: this.counter.x.clone().setPositionStart().toSteps()*conf.step.x,
		y: this.counter.y.clone().setPositionStart().toSteps()*conf.step.y
	})

	this.range.setEnd({
		x: this.counter.x.clone().setPositionEnd().toSteps()*conf.step.x,
		y: this.counter.y.clone().setPositionEnd().toSteps()*conf.step.y
	})

	this.elements = [];

	this.hitAreas = [];

	this.selection = [];


}

JSL.gfx.Grid.prototype = Object.create( JSL.gfx.Canvas.prototype );
JSL.gfx.Grid.prototype.constructor = JSL.gfx.Grid;


JSL.gfx.Grid.prototype.setConf = function(conf){
	this.conf = conf;
	if(conf.position)
		this.position = conf.position;
}

JSL.gfx.Grid.prototype.init = function(){

	var grid = this;

	grid.refresh();

}


JSL.gfx.Grid.prototype.pan = function(vector){

	if(vector.x == 0 && vector.y == 0){
		return false;
	}

	var gridRect = this.getSize();

	gridRect.pan(vector.clone().multiply(this.step));

	//console.log(this.range, vector.clone().multiply(this.conf.step));

	if(this.range.contains(gridRect)){
		if(vector.y!=0){
			this.counter.y.iterate(1, vector.y);

		}
		if(vector.x!=0){
			this.counter.x.iterate(1, vector.x);
		}
		this.offset = gridRect.getStart();
		this.refresh();
	}
}

JSL.gfx.Grid.prototype.addElement = function(element){
	element.counter = {
		x: this.counter.x.clone().setPosition(element.position.x),
		y: this.counter.y.clone().setPosition(element.position.y)
	}
	var length = this.counter.x.clone().setPosition(element.length);
	element.length = length;
	delete(element.position);
	this.elements.push(element);
}


JSL.gfx.Grid.prototype.refresh = function(){

	var ctx = this.ctx;
	var conf = this.conf;
	var grid = this;

	ctx.canvas.width = $(ctx.canvas.parentNode).width();
	ctx.canvas.height = $(ctx.canvas.parentNode).height();

	var center = [ctx.canvas.width/2,ctx.canvas.height/2];
	var sizeVector = [ctx.canvas.width,ctx.canvas.height];

	function isNextStep(index, position, length){
		var isNextStep = true;
		for(var i = index+1; i < position.length; i++){
			isNextStep = (position[i] == length[i-1]-1) && isNextStep;
		}
		return isNextStep;
	}

	var patternIndex = 0;

	var colors = conf.colors;

	var range = conf.range;
	var position = conf.position;

	var step = conf.step;
	var sections = conf.sections;


/*
	this.visible = this.calculateVisible();


	var visibleRange = {
		x: grid.multiAdd(grid.position.x,grid.visible.x,conf.range.x.length),
		y: grid.multiSubtract(grid.position.y,grid.visible.y,conf.range.y.length)
	}*/

	var yCounter = this.counter.y.clone();
	var xCounter = this.counter.x.clone();

	// draw vertical sections
	for(var yStep = 0; yStep < sizeVector[1]; yStep += step.y){

		var backgroundColor = colors[sections.y.octave.pattern.backgrounds[yCounter.position[1]]];
		var pianoBGColor = (sections.y.octave.pattern.backgrounds[yCounter.position[1]] == 1) ?  "#999" : "#000";
		var pianoFGColor = (sections.y.octave.pattern.backgrounds[yCounter.position[1]] == 1) ?  "#000" : "#999";

		this.rect(new JSL.gfx.Rect(0, yStep, step.x, yStep+step.y), pianoBGColor,"#000");

		this.rect(new JSL.gfx.Rect(step.x, yStep, sizeVector[0],yStep+step.y), backgroundColor);

		if(sections.y.octave.pattern.labels[yCounter.position[1]]!=""){
			ctx.font="12px Arial";
			ctx.fillStyle=pianoFGColor;
			ctx.fillText(sections.y.octave.pattern.labels[yCounter.position[1]]+yCounter.position[0],2,yStep-6+18);
		}

		var borderColor = "";
		for(var index = yCounter.position.length-1; index >= 0; index--){
			if(index == yCounter.position.length-1){
				if(parseInt((yCounter.position[index]+1)/range.y.length[index]) == ((yCounter.position[index]+1)/range.y.length[index])){
					borderColor = colors[sections.y[conf.order.y[index]].border];
				}
			} else {
				if(isNextStep(index,yCounter.position,range.y.length)){
					borderColor = colors[sections.y[conf.order.y[index]].border];
				}
			}
		}

		this.line([step.x,yStep], [sizeVector[0],yStep],borderColor);

		// iterate the position
		yCounter.iterate(1);
	}

	// draw horizontal sections
	for(var xStep = step.x; xStep < sizeVector[0]; xStep += step.x){
		var borderColor = "";

		for(var index = xCounter.position.length-1; index >= 0; index--){
			if(index == xCounter.position.length-1){
				if(parseInt((xCounter.position[index]+1)/range.x.length[index]) == ((xCounter.position[index]+1)/range.x.length[index])){
					borderColor = colors[sections.x[conf.order.x[index]].border];
				}
			} else {
				if(isNextStep(index,xCounter.position,range.x.length)){
					borderColor = colors[sections.x[conf.order.x[index]].border];
				}
			}
		}

		this.line([xStep+step.x,0], [xStep+step.x,sizeVector[1]],borderColor);

		if(xCounter.toSteps() == grid.playHead.toSteps()){
			this.line([xStep,0], [xStep,sizeVector[1]],"#ccc");
		}

		// iterate the position
		xCounter.iterate(1);
	}


	yCounter.setPosition(this.counter.y.position);
	grid.hitAreas = [];
	// draw elements
	for(var yStep = 0; yStep < sizeVector[1]; yStep += step.y){

		this.elements.forEach(function(element, elementIndex){
			if(_.isEqual(element.counter.y.position,yCounter.position)){
				var relativeXSteps = element.counter.x.clone().merge(grid.counter.x, -1).toSteps();
				var elXPos = step.x+relativeXSteps*step.x;
				var elWidth = element.length.position[0]*step.x*16+element.length.position[1]*step.x*4+element.length.position[2]*step.x
				if((elXPos >= step.x && elXPos <= sizeVector[0])
					|| (elXPos+elWidth > step.x && elXPos+elWidth <= sizeVector[0])
					|| (elXPos<step.x && elXPos+elWidth > sizeVector[0]) ){
					if(elXPos-step.x < 0){
						elWidth = elWidth+(elXPos-step.x);
						elXPos = step.x;
					}
					if((elXPos+elWidth)>sizeVector[0]){
						elWidth -= elWidth+elXPos-sizeVector[0];
					}

					var elColor = (grid.selection.indexOf(elementIndex)>-1) ? "#ab7" : "#ccc";

					grid.rect(new JSL.gfx.Rect(elXPos+1, yStep+1, elWidth-2, step.y-2), elColor);

					grid.hitAreas.push({
						rect: new JSL.gfx.Rect().copy({
							x: elXPos+1,
							y: yStep+1,
							width: elWidth-2,
							height: step.y-2
						}),
						elementIndex: elementIndex
					})

				}
			}
		})

		// iterate the position
		yCounter.iterate(1);
	}

}
