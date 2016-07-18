'use strict';

import jQuery from 'jquery';
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

		jQuery(this.dom).on('mousedown', '.bar', function() {
			mousedown = true;
			lastBar = this;
			jQuery(this).toggleClass('selected');
			sequencer.refresh();
		});

		jQuery(this.dom).on('mousemove', '.bar', function() {
			if (mousedown === true && lastBar !== this) {
				lastBar = this;
				jQuery(this).toggleClass('selected');
				sequencer.refresh();
			}
		});

		jQuery('body').on('mouseup', function() {
			mousedown = false;
			lastBar = false;
		});

		jQuery(this.dom).on('change', '#bar-count', function() {
			sequencer.track.bars = jQuery(this).val();
			sequencer.redraw();
			sequencer.refresh();
		});

		this.redraw();
	}

	redraw() {
		var jQuerychannels = jQuery(this.dom).find('.channels');
		jQuerychannels.html('');
		if (this.track && this.track.channels) {
			this.track.channels.forEach(function(channel, index) {
				var jQuerychannel = jQuery('<div></div>')
					.addClass('channel').attr('id', 'channel' + index);
				jQuerychannel.append(jQuery('<div></div>')
					.addClass('channel-name').html(channel.name));
				jQuerychannel.append(jQuery('<input></input>')
					.addClass('channel-note').val(channel.note));
				var jQuerybars = jQuery('<div></div>').addClass('bars');

				var patternIndex = 0;
				for (let bar = 0; bar < jQuery('#bar-count').val(); bar++) {
					var jQuerybar = jQuery('<div></div>')
						.addClass('bar').attr('id', 'channel' + index + '-bar' + bar);
					if (channel.pattern) {
						if (channel.pattern[patternIndex] === 1) {
							jQuerybar.addClass('selected');
						}
						if (patternIndex < channel.pattern.length - 1) {
							patternIndex++;
						} else {
							patternIndex = 0;
						}
					}
					jQuerybars.append(jQuerybar);
				}

				jQuerychannel.append(jQuerybars);
				jQuerychannels.append(jQuerychannel);
			});
		}
	}

	refresh() {
		var sequencer = this;
		if (sequencer.track) {
			// refresh bars pattern
			jQuery(this.dom).find('.bars').each(function(channelIndex) {
				sequencer.track.channels[channelIndex].pattern = [];
				jQuery(this).find('.bar').each(function(barIndex) {
					if (jQuery(this).hasClass('selected')) {
						sequencer.track.channels[channelIndex].pattern.push(1);
					} else {
						sequencer.track.channels[channelIndex].pattern.push(0);
					}
				});
			});
		}
	}

	link(track) {
		this.track = track;
		jQuery(this.dom).find('#bar-count').val(track.bars);
		this.redraw();
		this.refresh();
	}

	tick(barIndex) {
		jQuery(this.dom).find('.bars').each(function() {
			jQuery(this).find('.bar').removeClass('current');
		});

		jQuery(this.dom).find('.bars').each(function(channelIndex) {
			jQuery(this).find('.bar').eq(barIndex).each(function() {
				jQuery(this).addClass('current');
			});
		});
	}

	stop() {

	}
}

export default Sequencer;
