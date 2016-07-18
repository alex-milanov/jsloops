'use strict';

import {durations, intervals, tonesInOctave} from '../../config/measure';

import jQuery from 'jquery';

import View from '../gfx/view';
import Editor from './editor';

class PianoRoll extends Editor {
	constructor(dom) {
		super(dom);

		this.viewConfig = {
			colors: [
				'#000', '#111', '#333', '#444', '#555', '#777'
			],
			step: {
				x: 38,
				y: 14
			},
			sections: {
				x: {
					tick: {
						steps: 1,
						border: 2
					},
					beat: {
						steps: 4,
						border: 3
					},
					measure: {
						beats: 16,
						border: 5
					}
				},
				y: {
					tone: {
						steps: 1,
						border: 2
					},
					octave: {
						steps: 12,
						border: 3,
						pattern: {
							values: [
								'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
							],
							labels: [
								'C', '', 'D', '', 'E', 'F', '', 'G', '', 'A', '', 'B'
							],
							backgrounds: [
								1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1
							],
							color: 4
						}
					}
				}
			},
			order: {
				x: ['measure', 'beat', 'tick'],
				y: ['octave', 'tone']
			},
			range: {
				x: {
					start: [0, 0, 0], // measure, beat, tick
					end: [16, 0, 1],
					length: [4, 4, 1],
					direction: 1
				},
				y: {
					start: [0, 8], // octave, tone
					end: [8, 0],
					length: [12, 1],
					direction: -1
				}
			},
			position: {			// default position
				x: [0, 0, 0],		// measure, beat, tick
				y: [5, 5]			// octave, tone
			},
			direction: {
				x: 1,
				y: -1
			}
		};

		this.view = new View(jQuery(this.dom).find('.view')[0], this.viewConfig);

		this.track = {};

		this.timeToPosition = function(time) {
			var measure = parseInt(time / intervals.measure, 10);
			time -= measure * intervals.measure;
			var beat = parseInt(time / intervals.beat, 10);
			time -= beat * intervals.beat;
			var tick = parseInt(time / intervals.tick, 10);
			time -= tick * intervals.tick;
			return [measure, beat, tick];
		};

		this.positionToTime = function(position) {
			var time = 0;
			time += position[0] * intervals.measure;
			time += position[1] * intervals.beat;
			time += position[2] * intervals.tick;
			return time;
		};
	}
	init() {
		super.init();
		this.view.init();

		this.redraw();
		this.refresh();

		var pianoRoll = this;
		var view = this.view;

		jQuery(this.dom).on('click', `[class*='-option']`, function(_ev) {
			var _optionParam = jQuery(this).data('option-param');
			var _optionValue = jQuery(this).data('option-value');

			jQuery(pianoRoll.dom).find(`.${_optionParam}-option`).removeClass('selected');
			jQuery(this).addClass('selected');

			view.data[_optionParam] = _optionValue;
		});

		view.signals.create.add(this.create());
	}

	create() {
		var scope = this;
		return function(counter) {
			var event = {};
			event.type = 'noteon';
			event.start = scope.positionToTime(counter.x.position);
			event.note = tonesInOctave[counter.y.position[1]];
			event.octave = counter.y.position[0];
			event.duration = durations.eighth;
			scope.track.events.push(event);
			scope.refresh();
		};
	}

	redraw() {
		// this.view.redraw();
	}

	refresh() {
		var pianoRoll = this;
		// var conf = pianoRoll.viewConfig;

		// var bottomCYPos = 12 * conf.step[1];
		// var initialXPos = conf.step[0];

		pianoRoll.view.layers.grid.elements = [];
		pianoRoll.track.events.forEach(function(event, eventIndex) {
			if (event.type === 'noteon') {
				var element = {
					position: {
						x: pianoRoll.timeToPosition(event.start),
						y: [event.octave || 4, tonesInOctave.indexOf(event.note)]
					},
					length: pianoRoll.timeToPosition(event.duration),
					update: function() {
						pianoRoll.track.events[eventIndex].start =
							pianoRoll.positionToTime(this.counter.x.position);
						pianoRoll.track.events[eventIndex].note =
							tonesInOctave[this.counter.y.position[1]];
						pianoRoll.track.events[eventIndex].octave =
							this.counter.y.position[0];
						pianoRoll.track.events[eventIndex].duration =
							pianoRoll.positionToTime(this.length.position);
					},
					remove: function() {
						console.log(eventIndex);
						pianoRoll.track.events.splice(eventIndex, 1);
						pianoRoll.refresh();
					}
				};

				pianoRoll.view.addElement(element);
			}
		});
		pianoRoll.view.refresh();
	}

	link(track) {
		this.track = track;
		this.redraw();
		this.refresh();
	}
}

export default PianoRoll;
