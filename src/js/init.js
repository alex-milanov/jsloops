"use strict";


var durations = {
	"whole": 240,
	"half": 120,
	"quarter": 60, // 960
	"eighth": 30,
	"sixteenth": 15,
}

var intervals = {
	measure: durations.whole,
	beat: durations.quarter,
	tick: durations.sixteenth
}

var tonesInOctave = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

var defaultSong = {
	name: "Song 1",
	bpm: 120,
	bars: 128,
	tracks: [
		{
			name: "Track 1",
			type: "sequencer",
			bars: 16,
			instr: [{
				name: "Sampler",
				settings: {
					mapping: {
						B0: "samples/kick01.ogg",
						Bb1: "samples/hihat_opened02.ogg",
						D1: "samples/snare01.ogg",
						Eb1: "samples/clap01.ogg"
					}
				}
			}],
			channels: [
				{
					name: "Channel 0",
					instr: "Sampler",
					note: "B0",
					pattern: [1,0,0,0,0,0,0,0]
				},
				{
					name: "Channel 1",
					instr: "Sampler",
					note: "Bb1",
					pattern: [0,0,1,0,0,0,1,0]
				},
				{
					name: "Channel 2",
					instr: "Sampler",
					note: "D1",
					pattern: [0,0,0,0,1,0,0,0]
				},
				{
					name: "Channel 3",
					instr: "Sampler",
					note: "Eb1"
				}
			],
			measures: [
				{
					start: 0,
					length: 16, //bars
					repeat: 4,
					events: [
						{
							type: "noteon",
							note: "B",
							octave: 0,
							start: 0,
							duration: durations.eighth
						},
						{
							type: "noteon",
							note: "Bb",
							octave: 1,
							start: durations.eighth*2,
							duration: durations.eighth
						},
						{
							type: "noteon",
							note: "D",
							octave: 1,
							start: durations.eighth*4,
							duration: durations.eighth
						},
						{
							type: "noteon",
							note: "Bb",
							octave: 1,
							start: durations.eighth*6,
							duration: durations.eighth
						}
					]
				}
			]
		},
		{
			name: "Track 2",
			type: "midi",
			bars: 32,
			measures: [
				{
					start: 0,
					length: 16, //bars
					repeat: 1,
					events: [
						{
							type: "noteon",
							note: "E",
							octave: 4,
							start: 0,
							duration: durations.quarter+durations.eighth
						},
						{
							type: "noteon",
							note: "E",
							octave: 4,
							start: durations.quarter+durations.eighth,
							duration: durations.quarter+durations.eighth
						},
						{
							type: "noteon",
							note: "E",
							octave: 4,
							start: (durations.quarter+durations.eighth)*2,
							duration: durations.quarter
						}
					]
				},
				{
					start: 32,
					bars: 16,
					repeat: 0,
					events: [
						{
							type: "noteon", 
							note: "F",
							octave: 4,
							start: durations.whole,
							duration: durations.quarter+durations.eighth
						},
						{
							type: "noteon",
							note: "F",
							octave: 4,
							start: durations.whole+durations.quarter+durations.eighth,
							duration: durations.quarter+durations.eighth
						},
						{
							type: "noteon",
							note: "F",
							octave: 4,
							start: durations.whole+(durations.quarter+durations.eighth)*2,
							duration: durations.quarter
						}
					]
				},
				{
					start: 48,
					length: 16, //bars
					repeat: 0,
					events: [
						{
							type: "noteon",
							note: "E",
							octave: 4,
							start: 0,
							duration: durations.quarter+durations.eighth
						},
						{
							type: "noteon",
							note: "E",
							octave: 4,
							start: durations.quarter+durations.eighth,
							duration: durations.quarter+durations.eighth
						},
						{
							type: "noteon",
							note: "E",
							octave: 4,
							start: (durations.quarter+durations.eighth)*2,
							duration: durations.quarter
						}
					]
				},
			],
			events: [
				/*{
					type: "noteon",
					note: "E",
					octave: 4,
					start: 0,
					duration: durations.quarter+durations.eighth
				},
				{
					type: "noteon",
					note: "E",
					octave: 4,
					start: durations.quarter+durations.eighth,
					duration: durations.quarter+durations.eighth
				},
				{
					type: "noteon",
					note: "E",
					octave: 4,
					start: (durations.quarter+durations.eighth)*2,
					duration: durations.quarter
				},
				{
					type: "noteon", 
					note: "F",
					octave: 4,
					start: durations.whole,
					duration: durations.quarter+durations.eighth
				},
				{
					type: "noteon",
					note: "F",
					octave: 4,
					start: durations.whole+durations.quarter+durations.eighth,
					duration: durations.quarter+durations.eighth
				},
				{
					type: "noteon",
					note: "F",
					octave: 4,
					start: durations.whole+(durations.quarter+durations.eighth)*2,
					duration: durations.quarter
				},*/
			]
			/*events: [
				{
					type: "noteon",
					note: "C",
					start: 0,
					duration: durations.eighth
				},
				{
					type: "noteon",
					note: "E",
					start: durations.eighth,
					duration: durations.eighth
				},
				{
					type: "noteon",
					note: "C",
					start: durations.eighth*2,
					duration: durations.eighth
				},
				{
					type: "noteon",
					note: "E",
					start: durations.eighth*3,
					duration: durations.eighth
				},
				{
					type: "noteon",
					note: "G",
					start: durations.eighth*4,
					duration: durations.half
				},
				{
					type: "noteon",
					note: "E",
					start: durations.whole-durations.eighth,
					duration: durations.eighth
				},
				{
					type: "noteon",
					note: "G",
					start: durations.whole,
					duration: durations.eighth
				},
				{
					type: "noteon",
					note: "G",
					start: durations.whole+durations.eighth,
					duration: durations.eighth
				},
				{
					type: "noteon",
					note: "F",
					start: durations.whole+durations.eighth*2,
					duration: durations.eighth
				},
				{
					type: "noteon",
					note: "F",
					start: durations.whole+durations.eighth*3,
					duration: durations.eighth
				},
				{
					type: "noteon",
					note: "E",
					start: durations.whole+durations.eighth*4,
					duration: durations.half
				}
			]*/
		}
	],
	arrangement: [
		{
			track: 0,
			start: 0,
			repeat: 8
		},
		{
			track: 1,
			start: 0,
			repeat: 4
		}
	]
}


$(document).ready(function(){

	var studio = new JSL.gui.Studio("body")

	studio.load(defaultSong);

	studio.init();
})
