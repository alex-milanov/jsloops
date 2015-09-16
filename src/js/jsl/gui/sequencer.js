"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gui === "undefined"){ JSL.gui = {}; }

JSL.gui.Sequencer = function(dom, context){
	JSL.gui.Editor.call(this, dom, context);

	this._track = false;
}

JSL.gui.Sequencer.prototype = Object.create( JSL.gui.Editor.prototype );
JSL.gui.Sequencer.prototype.constructor = JSL.gui.Sequencer;

JSL.gui.Sequencer.prototype.init = function(){
	JSL.gui.Editor.prototype.init.call(this);

	var sequencer = this;

	var mousedown = false;
	var lastBar = false;

	$(this._dom).on("mousedown", ".bar", function(){
		mousedown = true;
		lastBar = this;
		$(this).toggleClass("selected");
		sequencer.refresh();
	})

	$(this._dom).on("mousemove", ".bar", function(){
		if(mousedown == true && lastBar !== this){
			lastBar = this;
			$(this).toggleClass("selected");
			sequencer.refresh();
		}
	})


	$("body").on("mouseup", function(){
		mousedown = false;
		lastBar = false;
	})


	$(this._dom).on("change", "#bar-count", function(){
		this_track.bars = $(this).val();
		this.redraw();
	})

	this.redraw();

}

JSL.gui.Sequencer.prototype.redraw = function(){

	var $channels = $(this._dom).find(".channels");
	$channels.html("");
	if(this._track && this._track.channels){
		this._track.channels.forEach(function(channel, index){
			var $channel = $("<div></div>").addClass("channel").attr("id","channel"+index);
			$channel.append($("<div></div>").addClass("channel-name").html(channel.name));
			$channel.append($("<input></input>").addClass("channel-note").val(channel.note));
			var $bars = $("<div></div>").addClass("bars");

			var patternIndex = 0;
			for(var bar = 0; bar < $("#bar-count").val(); bar++){
				var $bar = $("<div></div>").addClass("bar").attr("id","channel"+index+"-bar"+bar);
				if(channel.pattern){
					if(channel.pattern[patternIndex] == 1){
						$bar.addClass("selected");
					}
					if(patternIndex < channel.pattern.length-1){
						patternIndex++;
					} else {
						patternIndex = 0;
					}
				}
				$bars.append($bar);
					
			}
			$channel.append($bars);
			$channels.append($channel);
		})
	}
}

JSL.gui.Sequencer.prototype.refresh = function(){
	var sequencer = this;
	if(sequencer._track){
		// refresh bars pattern
		$(this._dom).find(".bars").each(function(channelIndex){
			sequencer._track.channels[channelIndex].pattern = [];
			$(this).find(".bar").each(function(barIndex){
				if($(this).hasClass("selected")){
					sequencer._track.channels[channelIndex].pattern.push(1);
				} else {
					sequencer._track.channels[channelIndex].pattern.push(0);
				}
			});
		});
	}
}


JSL.gui.Sequencer.prototype.link = function(track){
	this._track = track;
	$(this._dom).find("#bar-count").val(track.bars);
	this.redraw();
	this.refresh();
}

JSL.gui.Sequencer.prototype.tick = function(barIndex){
	$(this._dom).find(".bars").each(function(){
		$(this).find(".bar").removeClass("current");
	});

	$(this._dom).find(".bars").each(function(channelIndex){
		$(this).find(".bar").eq(barIndex).each(function(){
			$(this).addClass("current");
		});		
	});
}

JSL.gui.Sequencer.prototype.stop = function(){
	
}