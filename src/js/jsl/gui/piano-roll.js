"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gui === "undefined"){ JSL.gui = {}; }

JSL.gui.PianoRoll = function(dom, context){
	JSL.gui.Editor.call(this, dom, context);

	this._gridConf = {
		step: [38,14],
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

	this._track = {};

	this._grid = new JSL.gfx.Grid($(this._dom).find("canvas.grid")[0],this._gridConf);

}

JSL.gui.PianoRoll.prototype = Object.create( JSL.gui.Editor.prototype );
JSL.gui.PianoRoll.prototype.constructor = JSL.gui.PianoRoll;


JSL.gui.PianoRoll.prototype.init = function(){

	JSL.gui.Editor.prototype.init.call(this);

	this.redraw();
	this.refresh();
}

JSL.gui.PianoRoll.prototype.redraw = function(){
	this._grid.redraw();
}

JSL.gui.PianoRoll.prototype.refresh = function(){
	
	var pianoRoll = this;
	var conf = pianoRoll._gridConf;

	var bottomCYPos = 12*conf.step[1];
	var initialXPos = conf.step[0];

	this._track.events.forEach(function(event){
		if(event.type == "noteon"){
			
			var startPos = [
				(initialXPos+event.start/30*conf.step[0]),
				(conf.labels.indexOf(event.note)*conf.step[1])
			]

			if(event.note == "C"){
				startPos[1] = bottomCYPos;
			}
			
			var endPos = [
				(event.duration/30*conf.step[0]),
				conf.step[1]
			]

			pianoRoll._grid.rect(startPos, endPos, "#999", "#555");
		}
	})

}

JSL.gui.PianoRoll.prototype.link = function(track){
	this._track = track;
	this.redraw();
	this.refresh();
}

