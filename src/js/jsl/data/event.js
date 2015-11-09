"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.data === "undefined"){ JSL.data = {}; }


JSL.data.Event = function(event){

	JSL.data.Object.call( this );

	this.objectType = "Event";

	this.type = event.type || "noteon";
	this.start = event.start || 0;
	this.duration = event.duration || 0;

	this.note = event.note || "C";
	this.octave = event.octave || 4;

}

JSL.data.Event.prototype = Object.create( JSL.data.Object.prototype );
JSL.data.Event.prototype.constructor = JSL.data.Event;