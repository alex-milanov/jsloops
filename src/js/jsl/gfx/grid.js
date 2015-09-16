"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gfx === "undefined"){ JSL.gfx = {}; }


JSL.gfx.Grid = function(dom, conf){

	JSL.gfx.Canvas.call(this, dom);

	this._conf = conf;

}

JSL.gfx.Grid.prototype = Object.create( JSL.gfx.Canvas.prototype );
JSL.gfx.Grid.prototype.constructor = JSL.gfx.Grid;

JSL.gfx.Grid.prototype.redraw = function(){

	var ctx = this._ctx;
	var conf = this._conf;

	ctx.canvas.width = $(ctx.canvas.parentNode).width();
	ctx.canvas.height = $(ctx.canvas.parentNode).height();

	var center = [ctx.canvas.width/2,ctx.canvas.height/2];
	var sizeVector = [ctx.canvas.width,ctx.canvas.height];

	var patternIndex = 0;

	for(var yPos = 0; yPos < sizeVector[1]; yPos += conf.step[1]){

		var backgroundColor = conf.backgrounds[conf.backgroundPattern[patternIndex]];
		var pianoBGColor = (conf.backgroundPattern[patternIndex] == 1) ?  "#999" : "#000";
		var pianoFGColor = (conf.backgroundPattern[patternIndex] == 1) ?  "#000" : "#999";

		//
		this.rect([0,yPos], [conf.step[0],yPos+conf.step[1]], pianoBGColor,"#000");

		this.rect([conf.step[0],yPos], [sizeVector[0],yPos+conf.step[1]], backgroundColor);

		ctx.font="14px Georgia";
		ctx.fillStyle=pianoFGColor;
		ctx.fillText(conf.labels[patternIndex],5,yPos-6+18);

		if(patternIndex < conf.backgroundPattern.length-1){
			patternIndex++;
		} else {
			patternIndex = 0;
		}

		var lineColor = conf.color;
		for(var section in conf.sections){
			if(parseInt(yPos/conf.step[1]/conf.sections[1][section]) == yPos/conf.step[1]/conf.sections[1][section]){
				lineColor = conf.sectionColors[1][section];
			}
		}
		this.line([conf.step[0],yPos], [sizeVector[0],yPos],null,lineColor);
	}

	// draw horizontal sectors
	for(var xPos = conf.step[0]; xPos < sizeVector[0]; xPos += conf.step[0]){
		var lineColor = conf.color;
		for(var section in conf.sections[0]){
			if(parseInt((xPos-conf.step[0])/conf.step[0]/conf.sections[0][section]) == (xPos-conf.step[0])/conf.step[0]/conf.sections[0][section]){
				lineColor = conf.sectionColors[0][section];
			}
		}
		this.line([xPos,0], [xPos,sizeVector[1]],null,lineColor);
	}
}