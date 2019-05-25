'use strict';

const Rx = require('rx');
const {Subject} = Rx;

const track = require('./track');

const stream = new Subject();

const init = () => stream.onNext(state => ({
	...state
}));

module.exports = {
	stream,
	init,
	track
};
