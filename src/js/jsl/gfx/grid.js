"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gfx === "undefined"){ JSL.gfx = {}; }


JSL.gfx.Grid = function(dom, conf){

	JSL.gfx.Canvas.call(this, dom);

	this._conf = conf;

}

JSL.gfx.Grid.prototype = Object.create( JSL.gfx.Canvas.prototype );
JSL.gfx.Grid.prototype.constructor = JSL.gfx.Grid;


JSL.gfx.Grid.prototype.setConf = function(conf){
	this._conf = conf;
} 

JSL.gfx.Grid.prototype.redraw = function(){

	var ctx = this._ctx;
	var conf = this._conf;

	ctx.canvas.width = $(ctx.canvas.parentNode).width();
	ctx.canvas.height = $(ctx.canvas.parentNode).height();

	var center = [ctx.canvas.width/2,ctx.canvas.height/2];
	var sizeVector = [ctx.canvas.width,ctx.canvas.height];

	var patternIndex = 0;

	var colors = conf.colors;

	var range = conf.range;
	var position = conf.position;
	var direction = conf.direction;

	console.log(conf);

	var step = conf.step;
	var sect = conf.sections;
	var rel = conf.relations;

	var position = conf.position;

	var yPosition = _.clone(conf.position.y)

	console.log(yPosition);
	// draw vertical sections
	for(var yStep = 0; yStep < sizeVector[1]; yStep += step.y){

		var backgroundColor = colors[sect.y.octave.pattern.backgrounds[patternIndex]];
		var pianoBGColor = (sect.y.octave.pattern.backgrounds[patternIndex] == 1) ?  "#999" : "#000";
		var pianoFGColor = (sect.y.octave.pattern.backgrounds[patternIndex] == 1) ?  "#000" : "#999";

		this.rect([0,yStep], [step.x, yStep+step.y], pianoBGColor,"#000");

		this.rect([step.x,yStep], [sizeVector[0],yStep+step.y], backgroundColor);

		ctx.font="14px Georgia";
		ctx.fillStyle=pianoFGColor;
		console.log(patternIndex);
		ctx.fillText(sect.y.octave.pattern.labels[patternIndex],5,yStep-6+18);

		rel.y.forEach(function(section, relIndex){
			var container = (rel.y[relIndex+1]) ? rel.y[relIndex+1] : false;
			var start, limit;
			switch(direction.y){
				case 1:
					start = (container) ? 0 : range.start.y[section];
					limit = (container) ? sect.y[container][section+"s"]-1 : range.end.y[section];
					if(yPosition[section] < limit){
						yPosition[section] += direction.y;
					} else {
						yPosition[section] = start;
					}
					break;
				case -1:
					start = (container) ? sect.y[container][section+"s"]-1 : range.start.y[section];
					limit = (container) ? 0 : range.end.y[section];
					if(yPosition[section] > limit){
						yPosition[section] += direction.y;
					} else {
						yPosition[section] = start;
					}
					break;
			}
			console.log(section, container, start, limit)
			
		});
		console.log(yPosition);

		

		var borderColor = colors[sect.y.tone.border];
		rel.y.forEach(function(section){
			if(parseInt(yStep/step.y/sect.y[section].steps) == yStep/step.y/sect.y[section].steps){
				borderColor = colors[sect.y[section].border];
			}
		});
		this.line([step.x,yStep], [sizeVector[0],yStep],null,borderColor);
	}

	/*
	// draw horizontal sections
	for(var xPos = conf.step[0]; xPos < sizeVector[0]; xPos += conf.step[0]){
		var lineColor = conf.color;
		for(var section in conf.sections[0]){
			if(parseInt((xPos-conf.step[0])/conf.step[0]/conf.sections[0][section]) == (xPos-conf.step[0])/conf.step[0]/conf.sections[0][section]){
				lineColor = conf.sectionColors[0][section];
			}
		}
		this.line([xPos,0], [xPos,sizeVector[1]],null,lineColor);
	}
	*/
}