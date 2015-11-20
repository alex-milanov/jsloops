"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gui === "undefined"){ JSL.gui = {}; }


JSL.gui.Track = function(dom){
	iblokz.Element.call(this, dom);
}

JSL.gui.Track.prototype = Object.create( iblokz.Element.prototype );
JSL.gui.Track.prototype.constructor = JSL.gui.Track;

JSL.gui.Track.prototype.init = function(){

}