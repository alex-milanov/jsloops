"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gui === "undefined"){ JSL.gui = {}; }

JSL.gui.PianoRoll = function(dom, context){
	JSL.gui.Editor.call(this, dom, context);
}

JSL.gui.PianoRoll.prototype = Object.create( JSL.gui.Editor.prototype );
JSL.gui.PianoRoll.prototype.constructor = JSL.gui.PianoRoll;