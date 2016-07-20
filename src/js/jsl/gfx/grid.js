'use strict';

import _ from 'lodash';

// import d from '../../iblokz/dom';

import Counter from '../etc/counter';

import Vector2 from './vector2';
import Rect from './rect';
import Canvas from './canvas';

class Grid extends Canvas {
	constructor(dom, conf) {
		super(dom);

		this.conf = conf;
		var range = conf.range;
		var position = conf.position;

		this.step = new Vector2().copy(conf.step);

		this.counter = {
			x: new Counter(
				range.x.length, [range.x.start, range.x.end], range.x.direction, position.x
			),
			y: new Counter(
				range.y.length, [range.y.start, range.y.end], range.y.direction, position.y
			)
		};

		this.playHead = this.counter.x.clone();

		this.offset = new Vector2(
			this.counter.x.toSteps() * conf.step.x,
			this.counter.y.toSteps() * conf.step.y
		);

		this.range = new Rect();

		this.range.setStart({
			x: this.counter.x.clone().setPositionStart().toSteps() * conf.step.x,
			y: this.counter.y.clone().setPositionStart().toSteps() * conf.step.y
		});

		this.range.setEnd({
			x: this.counter.x.clone().setPositionEnd().toSteps() * conf.step.x,
			y: this.counter.y.clone().setPositionEnd().toSteps() * conf.step.y
		});

		this.elements = [];

		this.hitAreas = [];

		this.selection = [];
	}

	setConf(conf) {
		this.conf = conf;
		if (conf.position)
			this.position = conf.position;
	}

	init() {
		var grid = this;

		grid.refresh();
	}

	pan(vector) {
		if (vector.x === 0 && vector.y === 0) {
			return false;
		}

		var gridRect = this.getSize();

		gridRect.pan(vector.clone().multiply(this.step));

		// console.log(this.range, vector.clone().multiply(this.conf.step));

		if (this.range.contains(gridRect)) {
			if (vector.y !== 0) {
				this.counter.y.iterate(1, vector.y);
			}
			if (vector.x !== 0) {
				this.counter.x.iterate(1, vector.x);
			}
			this.offset = gridRect.getStart();
			this.refresh();
		}
	}

	addElement(element) {
		element.counter = {
			x: this.counter.x.clone().setPosition(element.position.x),
			y: this.counter.y.clone().setPosition(element.position.y)
		};
		var length = this.counter.x.clone().setPosition(element.length);
		element.length = length;
		delete (element.position);
		this.elements.push(element);
	}

	refresh() {
		var ctx = this.ctx;
		var conf = this.conf;
		var grid = this;

		ctx.canvas.width = ctx.canvas.parentNode.clientWidth;
		ctx.canvas.height = ctx.canvas.parentNode.clientHeight;

		// var center = [ctx.canvas.width / 2, ctx.canvas.height / 2];
		var sizeVector = [ctx.canvas.width, ctx.canvas.height];

		const isNextStep = (index, position, length) => {
			var isNextStep = true;
			for (var i = index + 1; i < position.length; i++) {
				isNextStep = (position[i] === length[i - 1] - 1) && isNextStep;
			}
			return isNextStep;
		};

		// var patternIndex = 0;

		var colors = conf.colors;

		var range = conf.range;
		// var position = conf.position;

		var step = conf.step;
		var sections = conf.sections;

	/*
		this.visible = this.calculateVisible();

		var visibleRange = {
			x: grid.multiAdd(grid.position.x, grid.visible.x, conf.range.x.length),
			y: grid.multiSubtract(grid.position.y, grid.visible.y, conf.range.y.length)
		}*/

		var yCounter = this.counter.y.clone();
		var xCounter = this.counter.x.clone();

		// draw vertical sections
		for (let yStep = 0; yStep < sizeVector[1]; yStep += step.y) {
			var backgroundColor =
				colors[sections.y.octave.pattern.backgrounds[yCounter.position[1]]];
			var pianoBGColor =
				(sections.y.octave.pattern.backgrounds[yCounter.position[1]] === 1)
					? '#999'
					: '#000';
			var pianoFGColor =
				(sections.y.octave.pattern.backgrounds[yCounter.position[1]] === 1)
					? '#000'
					: '#999';

			this.rect(new Rect(0, yStep, step.x, yStep + step.y), pianoBGColor, '#000');

			this.rect(new Rect(step.x, yStep, sizeVector[0], yStep + step.y), backgroundColor);

			if (sections.y.octave.pattern.labels[yCounter.position[1]] !== '') {
				ctx.font = '12px Arial';
				ctx.fillStyle = pianoFGColor;
				ctx.fillText(
					sections.y.octave.pattern.labels[yCounter.position[1]] + yCounter.position[0],
					2,
					yStep - 6 + 18
				);
			}

			let borderColor = '';
			for (let index = yCounter.position.length - 1; index >= 0; index--) {
				if (index === yCounter.position.length - 1) {
					if (
						parseInt((yCounter.position[index] + 1) / range.y.length[index], 10) ===
						((yCounter.position[index] + 1) / range.y.length[index])
					) {
						borderColor = colors[sections.y[conf.order.y[index]].border];
					}
				} else if (isNextStep(index, yCounter.position, range.y.length)) {
					borderColor = colors[sections.y[conf.order.y[index]].border];
				}
			}

			this.line([step.x, yStep], [sizeVector[0], yStep], borderColor);

			// iterate the position
			yCounter.iterate(1);
		}

		// draw horizontal sections
		for (var xStep = step.x; xStep < sizeVector[0]; xStep += step.x) {
			var borderColor = '';

			for (var index = xCounter.position.length - 1; index >= 0; index--) {
				if (index === xCounter.position.length - 1) {
					if (
						parseInt((xCounter.position[index] + 1) / range.x.length[index], 10) ===
						((xCounter.position[index] + 1) / range.x.length[index])
					) {
						borderColor = colors[sections.x[conf.order.x[index]].border];
					}
				} else if (isNextStep(index, xCounter.position, range.x.length)) {
					borderColor = colors[sections.x[conf.order.x[index]].border];
				}
			}

			this.line([xStep + step.x, 0], [xStep + step.x, sizeVector[1]], borderColor);

			if (xCounter.toSteps() === grid.playHead.toSteps()) {
				this.line([xStep, 0], [xStep, sizeVector[1]], '#ccc');
			}

			// iterate the position
			xCounter.iterate(1);
		}

		yCounter.setPosition(this.counter.y.position);
		grid.hitAreas = [];
		// draw elements
		for (var yStep = 0; yStep < sizeVector[1]; yStep += step.y) {
			this.elements.forEach((element, elementIndex) => {
				if (_.isEqual(element.counter.y.position, yCounter.position)) {
					var relativeXSteps = element.counter.x.clone()
						.merge(grid.counter.x, -1).toSteps();
					var elXPos = step.x + relativeXSteps * step.x;
					var elWidth = element.length.position[0] * step.x * 16 +
						element.length.position[1] * step.x * 4 +
						element.length.position[2] * step.x;
					if ((elXPos >= step.x && elXPos <= sizeVector[0])
						|| (elXPos + elWidth > step.x && elXPos + elWidth <= sizeVector[0])
						|| (elXPos < step.x && elXPos + elWidth > sizeVector[0])) {
						if (elXPos - step.x < 0) {
							elWidth += elXPos - step.x;
							elXPos = step.x;
						}
						if ((elXPos + elWidth) > sizeVector[0]) {
							elWidth -= elWidth + elXPos - sizeVector[0];
						}

						var elColor = (grid.selection.indexOf(elementIndex) > -1) ? '#ab7' : '#ccc';

						grid.rect(
							new Rect(elXPos + 1, yStep + 1, elWidth - 2, step.y - 2), elColor
						);

						grid.hitAreas.push({
							rect: new Rect().copy({
								x: elXPos + 1,
								y: yStep + 1,
								width: elWidth - 2,
								height: step.y - 2
							}),
							elementIndex: elementIndex
						});
					}
				}
			});

			// iterate the position
			yCounter.iterate(1);
		}
	}
}

export default Grid;
