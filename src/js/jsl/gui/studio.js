'use strict';

import jQuery from 'jquery';

import Sampler from '../instr/sampler';
import BasicSynth from '../instr/basic-synth';

import Editor from './editor';
import PianoRoll from './piano-roll';
import Sequencer from './sequencer';

class Studio extends Editor {
	constructor(dom, context) {
		super(dom, context);

		this.actx = new AudioContext();

		this.tickIndex = -1;
		this.playLoop = false;

		this.song = {};

		this.kit = {
			Sampler: {
				B0: new Sampler(this.actx, 'samples/kick01.ogg'),
				Bb1: new Sampler(this.actx, 'samples/hihat_opened02.ogg'),
				D1: new Sampler(this.actx, 'samples/snare01.ogg'),
				Eb1: new Sampler(this.actx, 'samples/clap01.ogg')
			},
			Piano: new BasicSynth(this.actx, 'C5')
		};

		this.sequencer = new Sequencer(jQuery('.sequencer')[0]);
		this.pianoRoll = new PianoRoll(jQuery('.piano-roll')[0]);
	}

	tick() {
		var studio = this;
		if (this.tickIndex < this.song.bars - 1)
			this.tickIndex++;
		else
			this.tickIndex = 0;

		this.song.arrangement.forEach(function(item) {
			var track = studio.song.tracks[item.track];

			if (studio.tickIndex >= item.start
				&& studio.tickIndex < item.start + track.bars * item.repeat
			) {
				var trackTick = studio.tickIndex - item.start -
					parseInt(studio.tickIndex / track.bars, 10) * track.bars;
				var now = studio.actx.currentTime;

				switch (track.type) {
					case 'sequencer':
						/*
							track.events.forEach(function(event) {
								if (parseInt(event.start/15) == trackTick) {
									//var evStart = event.start/15-parseInt(event.start/15)
									//var evDuration = event.duration/60;
									if (studio.kit.Sampler[event.note+event.octave])
										studio.kit.Sampler[event.note+event.octave].play();
								}
							})
						*/

						track.channels.forEach(function(channel, channelIndex) {
							if (channel.pattern && channel.pattern[trackTick] === 1) {
								studio.kit.Sampler[channel.note].play();
							}
						});
						studio.sequencer.tick(trackTick);
						break;
					case 'midi':
						track.events.forEach(function(event) {
							if (parseInt(event.start / 15, 10) === trackTick) {
								var evStart = event.start / 15 - parseInt(event.start / 15, 10);
								var evDuration = event.duration / 60;
								studio.kit.Piano.clone()
									.trigger(now + evStart, evDuration, event.note + event.octave);
							}
						});
						break;
					default:
						break;
				}
			}
		});

		if (this.sequencer) {

		}
	}

	load(data) {
		this.song = Object.assign({}, data);
		jQuery('#bpm').val(this.song.bpm);
		this.sequencer.link(this.song.tracks[0]);
		this.pianoRoll.link(this.song.tracks[1]);
	}

	init() {
		// iblokz.Element.prototype.init.call(this);

		var song = this.song;
		var sequencer = this.sequencer;
		var pianoRoll = this.pianoRoll;

		var playLoop = this.playLoop;
		// var tickIndex = this.tickIndex;

		var studio = this;

		sequencer.init();
		pianoRoll.init();

		jQuery('#play').click(function() {
			if (playLoop) {
				clearInterval(playLoop);
				playLoop = false;
			} else {
				var bpm = parseInt(jQuery('#bpm').val(), 10);
				playLoop = setInterval(function() {
					studio.tick();
				}, 60 / bpm * 1000 / 4);

				// play the second track
				/*
					song.tracks[1].events.forEach(function(event) {
						kit['P'].trigger(context.currentTime+15/bpm+
							(event.start/bpm),event.duration/bpm,event.note+5)
					});*/
			}

			jQuery(this).toggleClass('active');
		});

		jQuery('#stop').click(function() {
			if (playLoop) {
				clearInterval(playLoop);
			}
			playLoop = false;
			jQuery('.bars').each(function() {
				jQuery(this).find('.bar').removeClass('current');
			});

			studio.tickIndex = -1;

			jQuery('#play').removeClass('active');
		});

		jQuery('#bpm').change(function() {
			song.bpm = jQuery(this).val();
			if (playLoop) {
				clearInterval(playLoop);
				playLoop = setInterval(function() {
					studio.tick();
				}, 60 / jQuery('#bpm').val() * 1000 / 4);
			}
		});

		jQuery('#save').click(function() {
			var blob = new Blob([JSON.stringify(song)], {type: 'text/plain;charset=utf-8'});
			window.saveAs(blob, 'song.json');
		});

		jQuery('#load').click(function() {
			jQuery('#load-file').click();
		});

		jQuery('#load-file').change(function() {
			const receivedText = e => {
				var data = JSON.parse(e.target.result);
				studio.load(data);
			};

			var file = this.files[0];
			var fr = new FileReader();
			fr.onload = receivedText;
			fr.readAsText(file);
		});

		jQuery('#clear').click(function() {
			// studio.load(defaultSong);
			studio.load({});
		});
	}

	refresh() {

	}

}

export default Studio;
