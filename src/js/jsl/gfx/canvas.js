"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gfx === "undefined"){ JSL.gfx = {}; }

JSL.gfx.Canvas = function(dom) {
	iblokz.Element.call(this, dom);
	this.ctx = this.dom.getContext("2d");

	this.offset = new JSL.gfx.Vector2(0,0);
}

JSL.gfx.Canvas.prototype = Object.create( iblokz.Element.prototype );
JSL.gfx.Canvas.prototype.constructor = JSL.gfx.Canvas;


JSL.gfx.Canvas.prototype.clear = function(){
	this.ctx.clearRect(0,0,this.dom.width,this.dom.height);
}

JSL.gfx.Canvas.prototype.line = function(start, finish, stroke, dash){
	this.ctx.beginPath();
	this.ctx.moveTo(start[0],start[1]);
	this.ctx.lineTo(finish[0],finish[1]);
	if(dash) {
		this.ctx.setLineDash(dash);
	}
	this.ctx.lineWidth = 1;
	this.ctx.strokeStyle = stroke;
	this.ctx.stroke();
}

JSL.gfx.Canvas.prototype.rect = function(rect, background, stroke, dash){
	this.ctx.beginPath();
	this.ctx.rect(rect.x, rect.y, rect.width, rect.height);
	if(background){
		this.ctx.fillStyle = background;
		this.ctx.fill();
	}
	if(dash) {
		this.ctx.setLineDash(dash);
	}
	if(stroke){
		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle = stroke;
		this.ctx.stroke();
	}
}

JSL.gfx.Canvas.prototype.getSize = function(){
	var size = new JSL.gfx.Rect();
	size.width = this.ctx.canvas.width;
	size.height = this.ctx.canvas.height;
	size.x = this.offset.x;
	size.y = this.offset.y;
	return size;
}

JSL.gfx.Canvas.prototype.init = function() {
	this.refresh();
} 

JSL.gfx.Canvas.prototype.refresh = function() {
	this.ctx.canvas.width = $(this.ctx.canvas).width();
	this.ctx.canvas.height = $(this.ctx.canvas).height();
} 