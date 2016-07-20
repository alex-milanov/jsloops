'use strict';

import fn from './fn';

const listToArray = data => Array.prototype.slice.call(data);

const clear = parent => {
	while (parent.firstChild) parent.removeChild(parent.firstChild);
};

const find = (el, query) => listToArray(
	(el instanceof HTMLElement) && el.querySelectorAll(query)
		|| (typeof el === 'string') && document.querySelectorAll(el)
);

const findOne = fn.compose(
		find,
		elList => (elList.length === 0) && elList.pop() || elList
);

// el.class#id
const create = (code, attr) => {
	let id = code.match(/(#[a-zA-Z0-9\-]+)/ig);
	id = id && id.pop().replace('#', '');
	let classes = code.match(/(\.[a-zA-Z0-9\-]+)/ig);
	classes = classes && classes.map(cls => cls.replace('.', '')) || [];
	const tagName = code.replace('#' + id, '').replace('.' + classes.join('.'), '');
	let el = Object.assign(document.createElement(tagName), attr);
	if (id) el.setAttribute('id', id);
	classes.forEach(cls => el.classList.add(cls));
	return el;
};

const singleOn = (el, eventName, selector, cb) =>
	(el instanceof HTMLElement || el === document)
		? el.addEventListener(eventName, ev => {
			// if (eventName === 'click' && typeof selector === 'string') {
			// 	console.log(ev, ev.target, listToArray(el.querySelectorAll(selector)));
			// }
			if (typeof selector === 'string' && typeof cb !== 'undefined') {
				let selectedList = listToArray(el.querySelectorAll(selector));
				let evPath = ev.path || [ev.target];
				let selectedEl = evPath.reduce(
					(sel, el) => sel || (selectedList.indexOf(el) > -1) && el || null,
					null
				);
				if (selectedEl) {
					cb(Object.assign({}, ev, {target: selectedEl}));
				}
			} else {
				(cb => cb(ev))(selector);
			}
		})
		: (typeof el === 'string') && singleOn(find(el), eventName, selector, cb);

const on = (el, eventName, selector, cb) =>
	(el instanceof Array)
		? el.forEach(el => singleOn(el, eventName, selector, cb))
		: singleOn(el, eventName, selector, cb);

const get = (el, attr, defaultValue) => el.getAttribute(attr) || defaultValue;
const set = (el, attr, value) => el.setAttribute(attr, value);

module.exports = {
	listToArray,
	clear,
	find,
	findOne,
	create,
	on,
	get,
	set
};
