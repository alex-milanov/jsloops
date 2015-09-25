"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gui === "undefined"){ JSL.gui = {}; }

JSL.gui.Studio = function(dom, context){
	iblokz.Element.call(this, dom, context);


	this._actx = new AudioContext;

	this._tickIndex = -1;
	this._playLoop = false;

	this._song = {};

	this._kit = {
		K: new JSL.instr.Sampler(this._actx, "samples/kick01.ogg"),
		H: new JSL.instr.Sampler(this._actx, "samples/hihat_opened02.ogg"),
		S: new JSL.instr.Sampler(this._actx, "samples/snare01.ogg"),
		C: new JSL.instr.Sampler(this._actx, "samples/clap01.ogg"),
		"P": new JSL.instr.BasicSynth(this._actx, "C5")
	}

	this._sequencer = new JSL.gui.Sequencer($(".sequencer")[0]);
	this._pianoRoll = new JSL.gui.PianoRoll($(".piano-roll")[0])
}

JSL.gui.Studio.prototype = Object.create( iblokz.Element.prototype );
JSL.gui.Studio.prototype.constructor = JSL.gui.Studio;

JSL.gui.Studio.prototype.tick = function(){
	var studio = this;
	if(this._tickIndex < this._song.bars -1)
		this._tickIndex++;
	else
		this._tickIndex = 0;

	this._song.arrangement.forEach(function(item){
		var track = studio._song.tracks[item.track];

		if(studio._tickIndex >= item.start && studio._tickIndex < item.start + track.bars * item.repeat){
			var trackTick = studio._tickIndex-item.start-parseInt(studio._tickIndex/track.bars)*track.bars;
			
			switch(track.type){
				case "sequencer":
					track.channels.forEach(function(channel, channelIndex){
						if(channel.pattern && channel.pattern[trackTick] == 1) {
							studio._kit[channel.note].play();
						}
					})
					studio._sequencer.tick(trackTick);
					break;
				case "midi":
					var now = studio._actx.currentTime;
					track.events.forEach(function(event){
						if(parseInt(event.start/15) == trackTick){		
							var evStart = event.start/15-parseInt(event.start/15)
							var evDuration = event.duration/15;
							studio._kit["P"].trigger(now+evStart, evDuration, event.note+"4");
						}
					})
					break;
			}
		}		
	})

	if(this._sequencer){
		
	}
}

JSL.gui.Studio.prototype.load = function(data){
	this._song = _.cloneDeep(data);
	$("#bpm").val(this._song.bpm);
	this._sequencer.link(this._song.tracks[0]);
	this._pianoRoll.link(this._song.tracks[1]);
}

JSL.gui.Studio.prototype.init = function(){
	iblokz.Element.prototype.init.call(this);

	var song = this._song;
	var sequencer = this._sequencer;
	var pianoRoll = this._pianoRoll;

	var playLoop = this._playLoop;
	var tickIndex = this._tickIndex;

	var studio = this;

	sequencer.init();
	pianoRoll.init();

	$("#play").click(function(){
		if(playLoop) {
			clearInterval(playLoop);
			playLoop = false;
		} else {

			var bpm = parseInt($("#bpm").val());
			playLoop = setInterval(function(){
				studio.tick()
			}, 60/bpm*1000/4);

			// play the second track
			/*song.tracks[1].events.forEach(function(event){
				kit["P"].trigger(context.currentTime+15/bpm+(event.start/bpm),event.duration/bpm,event.note+5)
			});*/
		}

		$(this).toggleClass("active");
	})

	$("#stop").click(function(){
		if(playLoop) {
			clearInterval(playLoop);
		}
		playLoop = false;
		$(".bars").each(function(){
			$(this).find(".bar").removeClass("current");
		});

		studio._tickIndex = -1;

		$("#play").removeClass("active");
	})


	$("#bpm").change(function(){
		song.bpm = $(this).val();
		if(playLoop) {
			clearInterval(playLoop);
			playLoop = setInterval(function(){
				studio.tick()
			}, 60/$("#bpm").val()*1000/4);
		}
	})

	$("#save").click(function(){
		var blob = new Blob([JSON.stringify(song)], {type: "text/plain;charset=utf-8"});
  		window.saveAs(blob, "song.json");
	})

	$("#load").click(function(){
		$("#load-file").click();
	})

	$("#load-file").change(function(){
		var file = this.files[0];
		var fr = new FileReader();
		fr.onload = receivedText;
		fr.readAsText(file);
		
		function receivedText(e) {
			var data = JSON.parse(e.target.result);
			studio.load(data);
		}
	})

	$("#clear").click(function(){
		studio.load(defaultSong);
	})


}

JSL.gui.Studio.prototype.refresh = function(){
	
}