"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gfx === "undefined"){ JSL.gfx = {}; }


JSL.gfx.Grid = function(dom, conf){

	JSL.gfx.Canvas.call(this, dom);

	this._conf = conf;
	this._position = conf.position;

	this._elements = [];

	this._multiAdd = function(arr1, arr2, length, index){
		
		var resultArr  = _.clone(arr1);

		if(resultArr.length!=arr2.length)
			return false;

		if(typeof index === "undefined")
			index = resultArr.length-1;

		if(index > 0){
			if((resultArr[index] + arr2[index]) > length[index-1]-1){
				resultArr[index] += arr2[index] - length[index-1]-1;
				resultArr[index-1]++;
			} else {
				resultArr[index] += arr2[index];
			}
			resultArr = this._multiAdd(resultArr, arr2, length, index-1);
		} else {
			resultArr[index] += arr2[index];
		}

		return resultArr;
	}

	this._multiSubtract = function(arr1, arr2, length, index){

		var resultArr  = _.clone(arr1);
		
		if(resultArr.length!=arr2.length)
			return false;

		if(typeof index === "undefined")
			index = resultArr.length-1;

		if(index > 0){
			if((resultArr[index]-arr2[index]) < 0){
				resultArr[index] = resultArr[index]+length[index-1]-arr2[index];
				resultArr[index-1]--;
			} else {
				resultArr[index] -= arr2[index];
			}
			resultArr = this._multiSubtract(resultArr, arr2, length, index-1);
		} else {
			resultArr[index] -= arr2[index];
		}

		return resultArr;
	}

	this._multiIterate = function(iterator, index, range, direction){
		var start, limit;
		
		start = (index>0) ? 0 : range.start[index];
		limit = (index>0) ? range.length[index-1]-1 : range.end[index];
		
		var turnover = false;
		
		switch(direction){
			case 1:
				if(_.isEqual(iterator,range.end)){
					return iterator;
				}
				if(iterator[index] < limit) {
					iterator[index] += direction;
				} else {
					iterator[index] = start;
					turnover = true;
				}
				break;
			case -1:
				if(_.isEqual(iterator,range.start)){
					return iterator;
				}
				if(iterator[index] > start){
					iterator[index] += direction;
				} else {
					iterator[index] = limit;
					turnover = true;
				}
				break;
		}

		if(index>0 && turnover){
			return this._multiIterate(iterator, index-1, range, direction);
		}

		return iterator;
	}

	this._calculateVisible = function(){
		var sizeVector = [this._ctx.canvas.width,this._ctx.canvas.height];

		var visible = {
			x: [0,0,0],
			y: [0,0]
		}

		visible = this._vectorToPos(visible, sizeVector, {x:1,y:1});

		return visible;
	}

	this._vectorToPos = function(startPos, vector, direction){
		var resultPos = _.cloneDeep(startPos);

		var conf = this._conf;
		var range = conf.range;
		var step = conf.step;
		for(var xStep = step.x; xStep < vector[0]; xStep += step.x){
			resultPos.x = this._multiIterate(resultPos.x, resultPos.x.length-1, range.x, direction.x);
		}

		for(var yStep = 0; yStep < vector[1]; yStep += step.y){
			resultPos.y = this._multiIterate(resultPos.y, resultPos.y.length-1, range.y, direction.y);
		}

		return resultPos;
	}

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

JSL.gfx.Grid.prototype.init = function(){

	var grid = this;
	var position = this._position;
	var conf = this._conf;

	this._visible = this._calculateVisible();

	/*
	$(this._dom).on('click', function(event) {
		var vector = [(event.offsetX-conf.step.x), (event.offsetY-conf.step.y)];
		console.log(grid._vectorToPos(position,vector,{
			x: conf.range.x.direction,
			y: conf.range.y.direction
		}));
	})
*/

	


	grid.refresh();

}


JSL.gfx.Grid.prototype.addElement = function(element){
	this._elements.push(element);
}


JSL.gfx.Grid.prototype.refresh = function(){

	var ctx = this._ctx;
	var conf = this._conf;
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

	

	this._visible = this._calculateVisible();

	
	var visibleRange = {
		x: grid._multiAdd(grid._position.x,grid._visible.x,conf.range.x.length),
		y: grid._multiSubtract(grid._position.y,grid._visible.y,conf.range.y.length)
	}

	var yPosition = _.clone(this._position.y);
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
		yPosition = this._multiIterate(yPosition, yPosition.length-1, range.y, range.y.direction)
	}

	var xPosition = _.clone(this._position.x)
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
		xPosition = this._multiIterate(xPosition, xPosition.length-1, range.x, range.x.direction)

		//console.log(xPosition);
	}


	yPosition = _.clone(this._position.y);
	// draw elements
	for(var yStep = 0; yStep < sizeVector[1]; yStep += step.y){

		this._elements.forEach(function(element){
			if(_.isEqual(element.position.y,yPosition)){
				var relativeXPos = grid._multiSubtract(element.position.x,grid._position.x,conf.range.x.length);
				var elXPos = step.x+relativeXPos[0]*step.x*16+relativeXPos[1]*step.x*4+relativeXPos[2]*step.x;
				var elWidth = element.length.x[0]*step.x*16+element.length.x[1]*step.x*4+element.length.x[2]*step.x				
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

					grid.rect([elXPos+1,yStep+1], [elWidth-2,step.y-2], "#ccc");
				}
			}
		})


		// iterate the position
		yPosition = this._multiIterate(yPosition, yPosition.length-1, range.y, range.y.direction)
	}

	
}