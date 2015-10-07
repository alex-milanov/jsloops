"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gui === "undefined"){ JSL.gui = {}; }

JSL.gui.PianoRoll = function(dom, context){
	JSL.gui.Editor.call(this, dom, context);

	/*this._gridConf = {
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
	}*/

	this._viewConfig = {
		"colors": [
			"#000","#111","#333","#444","#555","#777"
		],
		"step": {
			"x": 38,
			"y": 14
		},
		"sections": {
			"x": {
				"tick": {
					"steps": 1,
					"border": 2
				},
				"beat": {
					"steps": 4,
					"border": 3
				},
				"measure": {
					"beats": 16,
					"border": 5
				}
			},
			"y": {
				"tone": {
					"steps": 1,
					"border": 2
				},
				"octave": {
					"steps": 12,
					"border": 3,
					"pattern": {
						"values": [
							"C","C#","D","D#","E","F","F#","G","G#","A","A#","B"
						],
						"labels": [
							"C","","D","","E","F","","G","","A","","B"
						],
						"backgrounds": [
							1,0,1,0,1,1,0,1,0,1,0,1
						],
						"color": 4
					}
				}
			}
		},
		"order": {
			"x": ["measure","beat","tick"],
			"y": ["octave","tone"]
		},
		"range": {
			"x": {
				"start": [0,0,0], // measure, beat, tick
				"end": [16,0,0],
				"length": [4,4,1],
				"direction": 1
			},
			"y": {
				"start": [0,9], // octave, tone
				"end": [8,0],
				"length": [12,1],
				"direction": -1
			}
		},
		"position": {			// default position
			"x": [0,0,0],		// measure, beat, tick
			"y": [5,5]			// octave, tone
		},
		"direction": {
			"x": 1,
			"y": -1
		}
	}

	this._view = new JSL.gfx.View($(this._dom).find(".view")[0],{},this._viewConfig);

	this._track = {};


}

JSL.gui.PianoRoll.prototype = Object.create( JSL.gui.Editor.prototype );
JSL.gui.PianoRoll.prototype.constructor = JSL.gui.PianoRoll;


JSL.gui.PianoRoll.prototype.init = function(){

	JSL.gui.Editor.prototype.init.call(this);

	this._view.init();

	this.redraw();
	this.refresh();
}

JSL.gui.PianoRoll.prototype.redraw = function(){
	//this._view.redraw();
}

JSL.gui.PianoRoll.prototype.refresh = function(){
	
	var pianoRoll = this;
	var conf = pianoRoll._viewConfig;

	var bottomCYPos = 12*conf.step[1];
	var initialXPos = conf.step[0];

	/*
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
	*/

}

JSL.gui.PianoRoll.prototype.link = function(track){
	this._track = track;
	this.redraw();
	this.refresh();
}

