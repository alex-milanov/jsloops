"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gfx === "undefined"){ JSL.gfx = {}; }

JSL.gfx.Canvas = function(dom) {
	this._dom = dom;
	this._ctx = dom.getContext("2d");
}

JSL.gfx.Canvas.prototype.line = function(start, finish, dash, stroke){
	this._ctx.beginPath();
	this._ctx.moveTo(start[0],start[1]);
	this._ctx.lineTo(finish[0],finish[1]);
	//ctx.setLineDash(dash);
	this._ctx.lineWidth = 1;
	this._ctx.strokeStyle = stroke;
	this._ctx.stroke();
}

JSL.gfx.Canvas.prototype.rect = function(start, finish, background, stroke){
	this._ctx.beginPath();
	this._ctx.rect(start[0], start[1], finish[0], finish[1]);
	this._ctx.fillStyle = background;
	this._ctx.fill();
	if(stroke){
		this._ctx.lineWidth = 1;
		this._ctx.strokeStyle = stroke;
		this._ctx.stroke();
	}
}