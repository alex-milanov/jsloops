"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gui === "undefined"){ JSL.gui = {}; }

JSL.gui.PianoRoll = function(dom){
	JSL.gui.Editor.call(this, dom);

	/*this.gridConf = {
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

	this.viewConfig = {
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
				"end": [16,0,1],
				"length": [4,4,1],
				"direction": 1
			},
			"y": {
				"start": [0,8], // octave, tone
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

	this.view = new JSL.gfx.View($(this.dom).find(".view")[0],this.viewConfig);

	this.track = {};


}

JSL.gui.PianoRoll.prototype = Object.create( JSL.gui.Editor.prototype );
JSL.gui.PianoRoll.prototype.constructor = JSL.gui.PianoRoll;


JSL.gui.PianoRoll.prototype.init = function(){

	JSL.gui.Editor.prototype.init.call(this);

	this.view.init();

	this.redraw();
	this.refresh();

	var pianoRoll = this;
	var view = this.view;

	$(this.dom).on("click","[class*='-option']",function(_ev){

		var _optionParam = $(this).data("option-param");
		var _optionValue = $(this).data("option-value");

		$(pianoRoll.dom).find("."+_optionParam+"-option").removeClass("selected");
		$(this).addClass("selected");

		view.data[_optionParam] = _optionValue;
	});

}

JSL.gui.PianoRoll.prototype.redraw = function(){
	//this.view.redraw();
}

JSL.gui.PianoRoll.prototype.refresh = function(){

	var pianoRoll = this;
	var conf = pianoRoll.viewConfig;

	var bottomCYPos = 12*conf.step[1];
	var initialXPos = conf.step[0];

	function timeToPosition(time){
		var measure = parseInt(time/intervals.measure);
		time = time-measure*intervals.measure;
		var beat = parseInt(time/intervals.beat);
		time -= beat*intervals.beat;
		var tick = parseInt(time/intervals.tick);
		time -= tick*intervals.tick;
		return [measure,beat,tick];
	}

	function positionToTime(position){
			var time = 0;
			time += position[0]*intervals.measure;
			time += position[1]*intervals.beat;
			time += position[2]*intervals.tick;
			return time;
	}

	pianoRoll.view.layers.grid.elements = [];
	pianoRoll.track.events.forEach(function(event, eventIndex){
		if(event.type == "noteon"){


			var element = {
				position: {
					x: timeToPosition(event.start),
					y: [event.octave || 4, tonesInOctave.indexOf(event.note)]
				},
				length: {
					x: timeToPosition(event.duration),
					y: [0,1]
				},
				update: function(){
					pianoRoll.track.events[eventIndex].start = positionToTime(this.position.x);
					pianoRoll.track.events[eventIndex].note = tonesInOctave[this.position.y[1]];
					pianoRoll.track.events[eventIndex].octave = this.position.y[0];
					event.duration = positionToTime(this.length.x);
				}
			}

			pianoRoll.view.addElement(element);
		}
	})

}

JSL.gui.PianoRoll.prototype.link = function(track){
	this.track = track;
	this.redraw();
	this.refresh();
}
