"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gui === "undefined"){ JSL.gui = {}; }

JSL.gui.PianoRoll = function(dom, context){
	JSL.gui.Editor.call(this, dom, context);

	this._gridConf = {
		step: [36,18],
		sections: [
			[4,16],
			[8]
		],
		color: "#333",
		sectionColors: [
			["#444",'#777'],
			["#444"]
		],
		backgrounds: [
			"#000","#111"
		],
		backgroundPattern: [
			1,1,0,1,0,1,0,1,1,0,1,0
		],
		labels: [
			"C","B","A#","A","G#","G","F#","F","E","D#","D","C#"
		],
		labelColor: "#555"
	}


	this._grid = new JSL.gfx.Grid($(this._dom).find("canvas.grid")[0],this._gridConf);

}

JSL.gui.PianoRoll.prototype = Object.create( JSL.gui.Editor.prototype );
JSL.gui.PianoRoll.prototype.constructor = JSL.gui.PianoRoll;


JSL.gui.PianoRoll.prototype.init = function(){

	JSL.gui.Editor.prototype.init.call(this);

	this._grid.redraw();
}