"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.instr === "undefined"){ JSL.instr = {}; }

JSL.instr.BasicSynth = function(context, note) {
	this.context = context;
	this.note = note;
};

JSL.instr.BasicSynth.prototype.noteToFrequency = function (note) {
	var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
		key_number,
		octave;

	if (note.length === 3) {
		octave = note.charAt(2);
	} else {
		octave = note.charAt(1);
	}

	key_number = notes.indexOf(note.slice(0, -1));

	if (key_number < 3) {
		key_number = key_number + 12 + ((octave - 1) * 12) + 1;
	} else {
		key_number = key_number + ((octave - 1) * 12) + 1;
	}

	return 440 * Math.pow(2, (key_number - 49) / 12);
};


JSL.instr.BasicSynth.prototype.setup = function(note) {
	this.osc = context.createOscillator();
	this.osc.frequency.value = this.noteToFrequency(note);

	this.gain = this.context.createGain();
	this.osc.connect(this.gain);
	this.gain.connect(this.context.destination)
};



JSL.instr.BasicSynth.prototype.trigger = function(time, duration, note) {

	note = note || this.note;
	duration = duration || 0.5;
	note = note || this.note || "C";
	
	console.log(time, duration, note)

	this.setup(note);
    
	this.gain.gain.setValueAtTime(1, time);
	this.gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

	this.osc.start(time);

	this.osc.stop(time + duration);
};


JSL.instr.BasicSynth.prototype.play = function(){
	var now = this.context.currentTime;
	this.trigger(now); 
}