'use strict';

const Rx = require('rx');
const {Subject} = Rx;

const song = require('./song');
const studio = require('./studio');

const stream = new Subject();

const init = () => stream.onNext(state => ({
	...state
}));

module.exports = {
	stream,
	init,
	song,
	studio
};
