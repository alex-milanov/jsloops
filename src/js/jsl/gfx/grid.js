"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gfx === "undefined"){ JSL.gfx = {}; }


JSL.gfx.Grid = function(dom, conf){
	JSL.gfx.Canvas.call(this, dom);

	this.conf = conf;
	this.position = conf.position;

	this.elements = [];

	this.hitAreas = [];

	this.selection = [];

	this.multiAdd = function(arr1, arr2, length, index){
		
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
			resultArr = this.multiAdd(resultArr, arr2, length, index-1);
		} else {
			resultArr[index] += arr2[index];
		}

		return resultArr;
	}

	this.multiSubtract = function(arr1, arr2, length, index){

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
			resultArr = this.multiSubtract(resultArr, arr2, length, index-1);
		} else {
			resultArr[index] -= arr2[index];
		}

		return resultArr;
	}

	this.multiIterate = function(iterator, index, range, direction){
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
			return this.multiIterate(iterator, index-1, range, direction);
		}

		return iterator;
	}

	this.calculateVisible = function(){
		var sizeVector = [this.ctx.canvas.width,this.ctx.canvas.height];

		var visible = {
			x: [0,0,0],
			y: [0,0]
		}

		visible = this.vectorToPos(visible, sizeVector, {x:1,y:1});

		return visible;
	}

	this.vectorToPos = function(startPos, vector, direction){
		var resultPos = _.cloneDeep(startPos);

		var conf = this.conf;
		var range = conf.range;
		var step = conf.step;
		for(var xStep = step.x; xStep < vector[0]; xStep += step.x){
			resultPos.x = this.multiIterate(resultPos.x, resultPos.x.length-1, range.x, direction.x);
		}

		for(var yStep = 0; yStep < vector[1]; yStep += step.y){
			resultPos.y = this.multiIterate(resultPos.y, resultPos.y.length-1, range.y, direction.y);
		}

		return resultPos;
	}

}

JSL.gfx.Grid.prototype = Object.create( JSL.gfx.Canvas.prototype );
JSL.gfx.Grid.prototype.constructor = JSL.gfx.Grid;


JSL.gfx.Grid.prototype.setConf = function(conf){
	this.conf = conf;
	if(conf.position)
		this.position = conf.position;
}


JSL.gfx.Grid.prototype.setPosition = function(position){
	this.position = position;
}

JSL.gfx.Grid.prototype.init = function(){

	//JSL.gfx.View.prototype.init.call(this);

	var grid = this;
	var position = this.position;
	var conf = this.conf;

	this.visible = this.calculateVisible();

	/*
	$(this.dom).on('click', function(event) {
		var vector = [(event.offsetX-conf.step.x), (event.offsetY-conf.step.y)];
		console.log(grid.vectorToPos(position,vector,{
			x: conf.range.x.direction,
			y: conf.range.y.direction
		}));
	})
*/


	
	grid.refresh();

}


JSL.gfx.Grid.prototype.addElement = function(element){
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

	

	this.visible = this.calculateVisible();

	
	var visibleRange = {
		x: grid.multiAdd(grid.position.x,grid.visible.x,conf.range.x.length),
		y: grid.multiSubtract(grid.position.y,grid.visible.y,conf.range.y.length)
	}

	var yPosition = _.clone(this.position.y);
	// draw vertical sections
	for(var yStep = 0; yStep < sizeVector[1]; yStep += step.y){

		var backgroundColor = colors[sections.y.octave.pattern.backgrounds[yPosition[1]]];
		var pianoBGColor = (sections.y.octave.pattern.backgrounds[yPosition[1]] == 1) ?  "#999" : "#000";
		var pianoFGColor = (sections.y.octave.pattern.backgrounds[yPosition[1]] == 1) ?  "#000" : "#999";

		this.rect(new JSL.gfx.Rect(0, yStep, step.x, yStep+step.y), pianoBGColor,"#000");

		this.rect(new JSL.gfx.Rect(step.x, yStep, sizeVector[0],yStep+step.y), backgroundColor);

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

		this.line([step.x,yStep], [sizeVector[0],yStep],borderColor);

		// iterate the position
		yPosition = this.multiIterate(yPosition, yPosition.length-1, range.y, range.y.direction)
	}

	var xPosition = _.clone(this.position.x)
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

		this.line([xStep+step.x,0], [xStep+step.x,sizeVector[1]],borderColor);
		// iterate the position
		xPosition = this.multiIterate(xPosition, xPosition.length-1, range.x, range.x.direction)

		//console.log(xPosition);
	}


	yPosition = _.clone(this.position.y);
	grid.hitAreas = [];
	// draw elements
	for(var yStep = 0; yStep < sizeVector[1]; yStep += step.y){

		this.elements.forEach(function(element, elementIndex){
			if(_.isEqual(element.position.y,yPosition)){
				var relativeXPos = grid.multiSubtract(element.position.x,grid.position.x,conf.range.x.length);
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
		yPosition = this.multiIterate(yPosition, yPosition.length-1, range.y, range.y.direction)
	}

	
}