'use strict';

import fn from './fn';
import dom from './dom';

const assignKeyValue = (o, k, v) => (o[k] = v) && o;

const createCanvas = fn.compose(
	() => dom.create('canvas', {
		width: 24,
		height: 24
	}),
	canvas => canvas.getContext('2d'),
	ctx => Object.assign(ctx, {
		fillStyle: '#ffffff',
		font: '14px FontAwesome',
		textAlign: 'center',
		textBaseline: 'middle'
	})
);

const createIcon = (ctx, code) => {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.fillText(code, 12, 12);
	return ctx.canvas.toDataURL('image/png');
};

const prepIcons = fn.compose(
	list => ({ctx: createCanvas(), list}),
	({ctx, list}) =>
		Object.keys(list).reduce((o, key) =>
			assignKeyValue(o, key, createIcon(ctx, list[key])),
		{})
);

const setCursor = (el, dataURL) => {
	el.style.cursor = `url(${dataURL}), auto`;
};

export default {
	createCanvas,
	createIcon,
	prepIcons,
	setCursor
};
