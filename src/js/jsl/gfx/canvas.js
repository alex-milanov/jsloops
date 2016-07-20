'use strict';

import d from '../../iblokz/dom';

import Vector2 from './vector2';
import Rect from './rect';

class Canvas {
	constructor(dom) {
		this.dom = (dom instanceof HTMLElement) ? dom : d.findOne(dom);
		this.ctx = this.dom.getContext('2d');
		this.offset = new Vector2(0, 0);
	}

	clear() {
		this.ctx.clearRect(0, 0, this.dom.width, this.dom.height);
	}

	line(start, finish, stroke, dash) {
		this.ctx.beginPath();
		this.ctx.moveTo(start[0], start[1]);
		this.ctx.lineTo(finish[0], finish[1]);
		if (dash) {
			this.ctx.setLineDash(dash);
		}
		this.ctx.lineWidth = 1;
		this.ctx.strokeStyle = stroke;
		this.ctx.stroke();
	}

	rect(rect, background, stroke, dash) {
		this.ctx.beginPath();
		this.ctx.rect(rect.x, rect.y, rect.width, rect.height);
		if (background) {
			this.ctx.fillStyle = background;
			this.ctx.fill();
		}
		if (dash) {
			this.ctx.setLineDash(dash);
		}
		if (stroke) {
			this.ctx.lineWidth = 1;
			this.ctx.strokeStyle = stroke;
			this.ctx.stroke();
		}
	}

	getSize() {
		var size = new Rect();
		size.width = this.ctx.canvas.width;
		size.height = this.ctx.canvas.height;
		size.x = this.offset.x;
		size.y = this.offset.y;
		return size;
	}

	init() {
		this.refresh();
	}

	refresh() {
		this.ctx.canvas.width = this.dom.clientWidth;
		this.ctx.canvas.height = this.dom.clientHeight;
	}
}

export default Canvas;
