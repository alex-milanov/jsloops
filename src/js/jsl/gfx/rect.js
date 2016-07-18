'use strict';

import Vector2 from './vector2';

class Rect {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	set(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		return this;
	}

	setStart(start) {
		this.x = start.x;
		this.y = start.y;
		return this;
	}

	getStart() {
		var start = new Vector2();
		start.x = this.x;
		start.y = this.y;
		return start;
	}

	setEnd(end) {
		this.width = end.x - this.x;
		this.height = end.y - this.y;
		return this;
	}

	getEnd() {
		var end = new Vector2();
		end.x = this.x + this.width;
		end.y = this.y + this.height;
		return end;
	}

	getSize() {
		var end = new Vector2();
		end.x = this.width;
		end.y = this.height;
		return end;
	}

	fromVectors(a, b) {
		if (a.x <= b.x) {
			this.x = a.x;
			this.width = b.x - a.x;
		} else {
			this.x = b.x;
			this.width = a.x - b.x;
		}

		if (a.y <= b.y) {
			this.y = a.y;
			this.height = b.y - a.y;
		} else {
			this.y = b.y;
			this.height = a.y - b.y;
		}

		return this;
	}

	pan(v) {
		var start = this.getStart();
		start.add(v);
		this.setStart(start);
		return this;
	}

	resize(v) {
		var end = this.getEnd();
		end.add(v);
		this.setEnd(end);
		return this;
	}

	containsVector(v) {
		if ((v.x >= this.x && v.x <= this.x + this.width)
			&& (v.y >= this.y && v.y <= this.y + this.height)) {
			return true;
		}
		return false;
	}

	containsRect(rect) {
		var start = this.getStart();
		var end = this.getEnd();
		if ((start.x <= rect.x && rect.x + rect.width <= end.x)
			&& (start.y <= rect.y && rect.y + rect.height <= end.y)) {
			return true;
		}
		return false;
	}

	contains(obj) {
		if (obj instanceof Rect) {
			return this.containsRect(obj);
		}
		if (obj instanceof Vector2) {
			return this.containsVector(obj);
		}
		return false;
	}

	copy(rect) {
		this.x = rect.x || this.x;
		this.y = rect.y || this.y;
		this.width = rect.width || this.width;
		this.height = rect.height || this.height;

		return this;
	}

	clone() {
		var newRect = new Rect();
		newRect.x = this.x;
		newRect.y = this.y;
		newRect.width = this.width;
		newRect.height = this.height;
		return newRect;
	}
}

export default Rect;
