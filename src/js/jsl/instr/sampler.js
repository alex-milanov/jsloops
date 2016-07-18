'use strict';

class Sampler {
	constructor(context, file) {
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

		this.volume = this.context.createGain();
		this.volume.gain.value = 0.4;
	}

	setup() {
		this.source = this.context.createBufferSource();
		this.source.buffer = this.buffer;
		this.source.connect(this.volume);
		this.volume.connect(this.context.destination);
	}

	trigger(start, end) {
		this.setup();
		this.source.start(start);
		if (end) this.source.stop(end);
	}

	play(duration) {
		var now = this.context.currentTime;
		this.trigger(now, now + duration);
	}
}

export default Sampler;
