"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.data === "undefined"){ JSL.data = {}; }

JSL.data.Song = function(song){

	JSL.data.Object.call( this );

	this.objectType = "Song";

	this.name = song.name || "Untitled";
	this.bpm = song.bpm || 120;
	this.bars = song.bars || 128;

	this.tracks = this.children = [];

	song.tracks.forEach(function(track){
		this.add(new JSL.data.Track(track))
	});
}

JSL.data.Song.prototype = Object.create( JSL.data.Object.prototype );
JSL.data.Song.prototype.constructor = JSL.data.Song;

JSL.data.Song.prototype.load = function(song){

}