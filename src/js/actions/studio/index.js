'use strict';

const Rx = require('rx');
const {Subject} = Rx;

const pianoRoll = require('./piano-roll');
const sequencer = require('./sequencer');

const stream = new Subject();

const init = () => stream.onNext(state => ({
	...state
}));

module.exports = {
	stream,
	init,
	pianoRoll,
	sequencer
};
