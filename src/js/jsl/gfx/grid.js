"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gfx === "undefined"){ JSL.gfx = {}; }


JSL.gfx.Grid = function(dom, conf){

	JSL.gfx.Canvas.call(this, dom);

	this._conf = conf;
	this._position = conf.position;

}

JSL.gfx.Grid.prototype = Object.create( JSL.gfx.Canvas.prototype );
JSL.gfx.Grid.prototype.constructor = JSL.gfx.Grid;


JSL.gfx.Grid.prototype.setConf = function(conf){
	this._conf = conf;
	if(conf.position)
		this._position = conf.position;
}


JSL.gfx.Grid.prototype.setPosition = function(position){
	this._position = position;
}

JSL.gfx.Grid.prototype.redraw = function(){

	var ctx = this._ctx;
	var conf = this._conf;

	ctx.canvas.width = $(ctx.canvas.parentNode).width();
	ctx.canvas.height = $(ctx.canvas.parentNode).height();

	var center = [ctx.canvas.width/2,ctx.canvas.height/2];
	var sizeVector = [ctx.canvas.width,ctx.canvas.height];

	function multiIterate(iterator, index, range){
		var start, limit;
		switch(range.direction){
			case 1:
				start = (index>0) ? 0 : range.start[index];
				limit = (index>0) ? range.length[index-1]-1 : range.end[index];
				if(iterator[index] < limit) {
					iterator[index] += range.direction;
				} else {
					iterator[index] = start;
				}
				break;
			case -1:
				start = (index>0) ? range.length[index-1]-1 : range.start[index];
				limit = (index>0) ? 0 : range.end[index];
				if(iterator[index] > limit){
					iterator[index] += range.direction;
				} else {
					iterator[index] = start;
				}
				break;
		}
		if(index>0 && iterator[index] == start){
			return multiIterate(iterator, index-1, range);
		}

		return iterator;
	}

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
	var direction = conf.direction;

	var step = conf.step;
	var sections = conf.sections;

	var position = conf.position;

	var yPosition = _.clone(conf.position.y)

	// draw vertical sections
	for(var yStep = 0; yStep < sizeVector[1]; yStep += step.y){

		var backgroundColor = colors[sections.y.octave.pattern.backgrounds[yPosition[1]]];
		var pianoBGColor = (sections.y.octave.pattern.backgrounds[yPosition[1]] == 1) ?  "#999" : "#000";
		var pianoFGColor = (sections.y.octave.pattern.backgrounds[yPosition[1]] == 1) ?  "#000" : "#999";

		this.rect([0,yStep], [step.x, yStep+step.y], pianoBGColor,"#000");

		this.rect([step.x,yStep], [sizeVector[0],yStep+step.y], backgroundColor);

		if(sections.y.octave.pattern.labels[yPosition[1]]!=""){
			ctx.font="12px Arial";
			ctx.fillStyle=pianoFGColor;
			ctx.fillText(sections.y.octave.pattern.labels[yPosition[1]]+yPosition[0],2,yStep-6+18);
		}

		var borderColor = "";
		for(var index = yPosition.length-1; index >= 0; index--){
			if(index == yPosition.length-1){
				if(parseInt((yPosition[index]+1)/range.y.length[index]) == ((yPosition[index]+1)/range.y.length[index])){
					borderColor = colors[sections.y[conf.order.y[index]].border];
				}
			} else {
				if(isNextStep(index,yPosition,range.y.length)){
					borderColor = colors[sections.y[conf.order.y[index]].border];
				}
			}
		}

		this.line([step.x,yStep], [sizeVector[0],yStep],null,borderColor);

		// iterate the position
		yPosition = multiIterate(yPosition, yPosition.length-1, range.y)
	}

	
	var xPosition = _.clone(conf.position.x)
	// draw horizontal sections
	for(var xStep = step.x; xStep < sizeVector[0]; xStep += step.x){
		var borderColor = "";
		for(var index = xPosition.length-1; index >= 0; index--){
			if(index == xPosition.length-1){
				if(parseInt((xPosition[index]+1)/range.x.length[index]) == ((xPosition[index]+1)/range.x.length[index])){
					borderColor = colors[sections.x[conf.order.x[index]].border];
				}
			} else {
				if(isNextStep(index,xPosition,range.x.length)){
					borderColor = colors[sections.x[conf.order.x[index]].border];
				}
			}
		}

		this.line([xStep+step.x,0], [xStep+step.x,sizeVector[1]],null,borderColor);
		// iterate the position
		xPosition = multiIterate(xPosition, xPosition.length-1, range.x)

		//console.log(xPosition);
	}
}