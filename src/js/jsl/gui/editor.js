'use strict';

import d from '../../iblokz/dom';

class Editor {
	constructor(dom) {
		this.dom = (dom instanceof HTMLElement) ? dom : d.findOne(dom);
	}
	init() {
		const between = (a, b, c) => (a < b) && (b < c);

		// const icons = cursor.prepIcons({
		// 	hand: '\uf256',
		// 	resizeH: '\uf07e',
		// 	resizeV: '\uf07d'
		// });

		const editor = this;

		let state = 'idle';
		let offset = {x: 0, y: 0};
		let props = {};

		d.on(this.dom, 'mousedown', '.toolbar', ev => {
			if (state === 'idle') {
				state = 'dragging';
				offset = {
					x: ev.clientX - this.dom.offsetLeft,
					y: ev.clientY - this.dom.offsetTop
				};
			}
		});

		d.on(this.dom.parentNode, 'mousemove', ev => {
			if (state === 'dragging') {
				this.dom.style.left = (ev.clientX - offset.x) + 'px';
				this.dom.style.top = (ev.clientY - offset.y) + 'px';
			}
			if (state === 'resizing') {
				if (props.direction.x)
					this.dom.style.width = (ev.clientX - this.dom.offsetLeft + offset.x) + 'px';
				if (props.direction.y)
					this.dom.style.height = (ev.clientY - this.dom.offsetTop + offset.y) + 'px';
			}
		});

		// d.on(this.dom.parentNode, 'mouseout', ev => {
		// 	dragging = false;
		// 	offset = {x: 0, y: 0};
		// });

		d.on(this.dom.parentNode, 'mouseup', ev => {
			state = 'idle';
			offset = {x: 0, y: 0};
			props = {};
		});

		d.on(this.dom, 'mousedown', ev => {
			if (state === 'idle') {
				state = 'resizing';
				offset = {
					x: this.dom.clientWidth - ev.clientX + this.dom.offsetLeft,
					y: this.dom.clientHeight - ev.clientY + this.dom.offsetTop
				};
				if (
					(between(0, (editor.dom.clientWidth - ev.offsetX), 7))
					&& (between(0, (editor.dom.clientHeight - ev.offsetY), 7))
				) props.direction = {x: true, y: true};
				else if (between(0, (editor.dom.clientWidth - ev.offsetX), 7))
					props.direction = {x: true, y: false};
				else if (between(0, (editor.dom.clientHeight - ev.offsetY), 7))
					props.direction = {x: false, y: true};
				else {
					state = 'idle';
					offset = {x: 0, y: 0};
				}
			}
		});

		d.on(this.dom, 'mousemove', ev => {
			if (
				(between(0, (editor.dom.clientWidth - ev.offsetX), 7))
				&& (between(0, (editor.dom.clientHeight - ev.offsetY), 7))
			) editor.dom.style.cursor = 'se-resize';
			else if (between(0, (editor.dom.clientWidth - ev.offsetX), 7))
				editor.dom.style.cursor = 'ew-resize';
			else if (between(0, (editor.dom.clientHeight - ev.offsetY), 7))
				editor.dom.style.cursor = 'ns-resize';
			else
				editor.dom.style.cursor = 'default';
		});
	}
	refresh() {

	}
}

export default Editor;
