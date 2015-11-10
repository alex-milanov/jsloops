"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.data === "undefined"){ JSL.data = {}; }

JSL.data.Track = function(track){

	JSL.data.Object.call( this );

	this.objectType = "Track";

	this.type = track.type || "midi";

	this.name =  track.name || "Untitled Track";
	this.bars = track.bars || 32; // needs to be removed - i.e. a track can have several segments

	this.events = this.children = [];

	track.events.forEach(function(event){
		this.add(new JSL.data.Event(event))
	});
}

JSL.data.Track.prototype = Object.create( JSL.data.Object.prototype );
JSL.data.Track.prototype.constructor = JSL.data.Track;

JSL.data.Track.prototype.createEvent = function(){
	
}

JSL.data.Track.prototype.clone = function(){
	
}
