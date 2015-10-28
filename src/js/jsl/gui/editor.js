"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gui === "undefined"){ JSL.gui = {}; }

JSL.gui.Editor = function(dom){
	iblokz.Element.call(this, dom);
}

JSL.gui.Editor.prototype = Object.create( iblokz.Element.prototype );
JSL.gui.Editor.prototype.constructor = JSL.gui.Editor;

JSL.gui.Editor.prototype.init = function(){
	//iblokz.Element.prototype.init.call(this);

	/*
	$(this._dom).draggable({
		containment: "parent",
		cursor: "crosshair",
		grid: [5,5],
		handle: ".toolbar"
	});
	*/
}

JSL.gui.Editor.prototype.refresh = function(){
	
}