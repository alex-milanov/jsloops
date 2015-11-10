"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.etc === "undefined"){ JSL.etc = {}; }

JSL.etc.Signal = function(){
	this.listeners = [];
}

JSL.etc.Signal.prototype = {
	constructor: JSL.etc.Signal,
	add: function(listener){
		this.listeners.push(listener);
		return this.listeners.indexOf(listener);
	},
	remove: function(listener){
		var index = this.listeners.indexOf(listener);
		if(index>-1){
			this.listeners.splice(index,1);
		}
		return true;
	},
	dispatch: function(){
		var args = Array.prototype.slice.call(arguments);
		//console.log(args, arguments);
		this.listeners.forEach(function(listener){
			listener.apply(null, args);
		})
	}
}