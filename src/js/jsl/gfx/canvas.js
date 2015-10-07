"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gfx === "undefined"){ JSL.gfx = {}; }

JSL.gfx.Canvas = function(dom) {
	this._dom = dom;
	this._ctx = dom.getContext("2d");
}


JSL.gfx.Canvas.prototype.clear = function(){
	this._ctx.clearRect(0,0,this._dom.width,this._dom.height);
}

JSL.gfx.Canvas.prototype.line = function(start, finish, dash, stroke){
	this._ctx.beginPath();
	this._ctx.moveTo(start[0],start[1]);
	this._ctx.lineTo(finish[0],finish[1]);
	if(dash) {
		this._ctx.setLineDash(dash);
	}
	this._ctx.lineWidth = 1;
	this._ctx.strokeStyle = stroke;
	this._ctx.stroke();
}

JSL.gfx.Canvas.prototype.rect = function(start, finish, background, stroke, dash){
	this._ctx.beginPath();
	this._ctx.rect(start[0], start[1], finish[0], finish[1]);
	if(background){
		this._ctx.fillStyle = background;
		this._ctx.fill();
	}
	if(dash) {
		this._ctx.setLineDash(dash);
	}
	if(stroke){
		this._ctx.lineWidth = 1;
		this._ctx.strokeStyle = stroke;
		this._ctx.stroke();
	}
}


JSL.gfx.Canvas.prototype.init = function() {
	this.refresh();
} 

JSL.gfx.Canvas.prototype.refresh = function() {
	this._ctx.canvas.width = $(this._ctx.canvas).width();
	this._ctx.canvas.height = $(this._ctx.canvas).height();
} 