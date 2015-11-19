"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gui === "undefined"){ JSL.gui = {}; }


JSL.gui.TrackList = function(dom){
	JSL.gui.Editor.call(this, dom);
}

JSL.gui.TrackList.prototype = Object.create( JSL.gui.Editor.prototype );
JSL.gui.TrackList.prototype.constructor = JSL.gui.TrackList;


JSL.gui.TrackList.prototype.init = function(){
	JSL.gui.Editor.prototype.init.call(this);
}


JSL.gui.TrackList.prototype.refresh = function(){
	
}