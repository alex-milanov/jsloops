"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.instr === "undefined"){ JSL.instr = {}; }

JSL.instr.Sampler = function(context, file) {
	this.context = context;
	var sampler = this;
	var request = new XMLHttpRequest();
	request.open('get', file, true);
	request.responseType = 'arraybuffer';
	request.onload = function() {
		context.decodeAudioData(request.response, function(buffer) {		
			sampler.buffer = buffer;
		});
	};
	request.send();
};

JSL.instr.Sampler.prototype.setup = function() {
	this.source = this.context.createBufferSource();
	this.source.buffer = this.buffer;
	this.source.connect(this.context.destination);
};

JSL.instr.Sampler.prototype.trigger = function(time) {
	this.setup();
	this.source.start(time);
};

JSL.instr.Sampler.prototype.play = function(){
	var now = this.context.currentTime;
	this.trigger(now);
}