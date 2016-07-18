'use strict';

class Signal {
	constructor() {
		this.listeners = [];
	}

	add(listener) {
		this.listeners.push(listener);
		return this.listeners.indexOf(listener);
	}

	remove(listener) {
		var index = this.listeners.indexOf(listener);
		if (index > -1) {
			this.listeners.splice(index, 1);
		}
		return true;
	}

	dispatch() {
		var args = Array.prototype.slice.call(arguments);
		// console.log(args, arguments);
		this.listeners.forEach(function(listener) {
			listener.apply(null, args);
		});
	}
}

export default Signal;
