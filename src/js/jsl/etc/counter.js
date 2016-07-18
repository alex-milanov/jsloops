'use strict';

class Counter {
	constructor(intervals, range, direction, position) {
		// [12,1] in case of octaves -> tones
		// [4,4,1] measure -> beat -> tick
		this.intervals = intervals;
		this.range = range;
		this.direction = direction || 1;

		this.position = [];
		this.setPosition(position);
	}

	setPosition(position) {
		this.position = position && position.slice()
			|| (this.direction === 1) && this.range[0].slice() || this.range[1].slice();
		return this;
	}

	setPositionStart() {
		this.position = (this.direction === 1) ? this.range[0].slice() : this.range[1].slice();
		return this;
	}

	setPositionEnd() {
		this.position = (this.direction === 1) ? this.range[1].slice() : this.range[0].slice();
		return this;
	}

	fromSteps(steps) {
		this.setPosition();
		this.iterate(steps);
		return this;
	}

	toSteps() {
		var start = (this.direction === 1) ? this.range[0].slice() : this.range[1].slice();
		var steps = 0;
		for (var index = 0; index < this.position.length; index++) {
			steps += (this.position[index] - start[index]) * this.direction;
			steps *= this.intervals[index];
		}
		return steps;
	}

	iterate(steps = 1, direction = 1) {
		// 1*1 = 1, 1*-1 = -1; -1 * 1 = -1; -1 * -1 = 1;
		direction *= this.direction;

		for (let index = this.position.length - 1; index >= 0 && steps > 0; index--) {
			if (index > 0) {
				var interval = this.intervals[index - 1];
				var change = steps - parseInt(steps / interval, 10) * interval;
				steps = parseInt(steps / interval, 10); // for the next index

				this.position[index] += change * direction;

				if (direction === 1 && this.position[index] >= interval) {
					steps++;
					this.position[index] -= interval;
				}
				if (direction === -1 && this.position[index] < 0) {
					steps++;
					this.position[index] += interval;
				}
			} else {
				this.position[index] += direction * steps;
			}
		}
		return this;
	}

	merge(counter, direction) {
		this.iterate(counter.toSteps(), direction);
		return this;
	}

	clone() {
		var counter = new Counter(this.intervals, this.range, this.direction, this.position);
		return counter;
	}

	copy(counter) {
		this.intervals = counter.intervals;
		this.range = counter.range;
		this.direction = counter.direction;
		this.position = counter.position;
		return this;
	}
}

export default Counter;
