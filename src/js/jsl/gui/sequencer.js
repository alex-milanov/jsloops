"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gui === "undefined"){ JSL.gui = {}; }

JSL.gui.Sequencer = function(dom, context){
	JSL.gui.Editor.call(this, dom, context);

	this.track = false;
}

JSL.gui.Sequencer.prototype = Object.create( JSL.gui.Editor.prototype );
JSL.gui.Sequencer.prototype.constructor = JSL.gui.Sequencer;

JSL.gui.Sequencer.prototype.init = function(){
	JSL.gui.Editor.prototype.init.call(this);

	var sequencer = this;

	var mousedown = false;
	var lastBar = false;

	$(this.dom).on("mousedown", ".bar", function(){
		mousedown = true;
		lastBar = this;
		$(this).toggleClass("selected");
		sequencer.refresh();
	})

	$(this.dom).on("mousemove", ".bar", function(){
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


	$(this.dom).on("change", "#bar-count", function(){
		sequencer.track.bars = $(this).val();
		sequencer.redraw();
		sequencer.refresh();
	})

	this.redraw();

}

JSL.gui.Sequencer.prototype.redraw = function(){

	var $channels = $(this.dom).find(".channels");
	$channels.html("");
	if(this.track && this.track.channels){
		this.track.channels.forEach(function(channel, index){
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
	if(sequencer.track){
		// refresh bars pattern
		$(this.dom).find(".bars").each(function(channelIndex){
			sequencer.track.channels[channelIndex].pattern = [];
			$(this).find(".bar").each(function(barIndex){
				if($(this).hasClass("selected")){
					sequencer.track.channels[channelIndex].pattern.push(1);
				} else {
					sequencer.track.channels[channelIndex].pattern.push(0);
				}
			});
		});
	}
}


JSL.gui.Sequencer.prototype.link = function(track){
	this.track = track;
	$(this.dom).find("#bar-count").val(track.bars);
	this.redraw();
	this.refresh();
}

JSL.gui.Sequencer.prototype.tick = function(barIndex){
	$(this.dom).find(".bars").each(function(){
		$(this).find(".bar").removeClass("current");
	});

	$(this.dom).find(".bars").each(function(channelIndex){
		$(this).find(".bar").eq(barIndex).each(function(){
			$(this).addClass("current");
		});		
	});
}

JSL.gui.Sequencer.prototype.stop = function(){
	
}