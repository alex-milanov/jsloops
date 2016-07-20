'use strict';

import d from '../../iblokz/dom';
import Editor from './editor';

class Sequencer extends Editor {
	constructor(dom, context) {
		super(dom, context);
		this.track = false;
	}

	init() {
		super.init(this);

		var sequencer = this;

		var mousedown = false;
		var lastBar = false;

		console.log(this.dom);

		d.on(this.dom, 'mousedown', '.bar', ev => {
			mousedown = true;
			lastBar = ev.target;
			ev.target.classList.toggle('selected');
			sequencer.refresh();
		});

		d.on(this.dom, 'mousemove', '.bar', ev => {
			if (mousedown === true && lastBar !== this) {
				lastBar = this;
				ev.target.classList.toggle('selected');
				sequencer.refresh();
			}
		});

		d.on(document, 'mouseup', function() {
			mousedown = false;
			lastBar = false;
		});

		d.on(this.dom, 'change', '#bar-count', ev => {
			sequencer.track.bars = ev.target.value;
			sequencer.redraw();
			sequencer.refresh();
		});

		this.redraw();
	}

	redraw() {
		var channelsEl = d.findOne(this.dom, '.channels');
		d.clear(channelsEl);
		if (this.track && this.track.channels) {
			this.track.channels.forEach(function(chan, i) {
				var chanEl = d.create(`div.channel#channel${i}`);
				chanEl.appendChild(d.create(`div.channel-name`, {
					textContent: chan.name
				}));
				chanEl.appendChild(d.create(`input.channel-note`, {
					value: chan.note
				}));

				var barsEl = d.create(`div.bars`);

				var patternIndex = 0;
				for (let bar = 0; bar < d.findOne('#bar-count').value; bar++) {
					var barEl = d.create(`div.bar#channel${i}-bar${bar}`);
					if (chan.pattern) {
						if (chan.pattern[patternIndex] === 1) {
							barEl.classList.add('selected');
						}
						if (patternIndex < chan.pattern.length - 1) {
							patternIndex++;
						} else {
							patternIndex = 0;
						}
					}
					barsEl.appendChild(barEl);
				}

				chanEl.appendChild(barsEl);
				channelsEl.appendChild(chanEl);
			});
		}
	}

	refresh() {
		var sequencer = this;
		if (sequencer.track) {
			// refresh bars pattern
			d.find(this.dom, '.bars').forEach((barsEl, chanI) => {
				sequencer.track.channels[chanI].pattern =
					d.find(barsEl, '.bar')
						.map((barEl, barI) => (barEl.classList.contains('selected'))
							? 1 : 0
					);
			});
		}
	}

	link(track) {
		this.track = track;
		d.findOne(this.dom, '#bar-count').value = track.bars;
		this.redraw();
		this.refresh();
	}

	tick(barIndex) {
		d.find(this.dom, '.bars').forEach(chanEl =>
			d.find(chanEl, '.bar').forEach((el, i) => (i === barIndex)
				? (!el.classList.contains('current')) && el.classList.add('current')
				: el.classList.remove('current')
			)
		);
	}

	stop() {

	}
}

export default Sequencer;
