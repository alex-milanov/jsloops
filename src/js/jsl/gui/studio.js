"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.gui === "undefined"){ JSL.gui = {}; }

JSL.gui.Studio = function(dom, context){
	iblokz.Element.call(this, dom, context);


	this.actx = new AudioContext;

	this.tickIndex = -1;
	this.playLoop = false;

	this.song = {};

	this.kit = {
		K: new JSL.instr.Sampler(this.actx, "samples/kick01.ogg"),
		H: new JSL.instr.Sampler(this.actx, "samples/hihat_opened02.ogg"),
		S: new JSL.instr.Sampler(this.actx, "samples/snare01.ogg"),
		C: new JSL.instr.Sampler(this.actx, "samples/clap01.ogg"),
		"P": new JSL.instr.BasicSynth(this.actx, "C5")
	}

	this.sequencer = new JSL.gui.Sequencer($(".sequencer")[0]);
	this.pianoRoll = new JSL.gui.PianoRoll($(".piano-roll")[0]);

}

JSL.gui.Studio.prototype = Object.create( iblokz.Element.prototype );
JSL.gui.Studio.prototype.constructor = JSL.gui.Studio;

JSL.gui.Studio.prototype.tick = function(){
	var studio = this;
	if(this.tickIndex < this.song.bars -1)
		this.tickIndex++;
	else
		this.tickIndex = 0;

	this.song.arrangement.forEach(function(item){
		var track = studio.song.tracks[item.track];

		if(studio.tickIndex >= item.start && studio.tickIndex < item.start + track.bars * item.repeat){
			var trackTick = studio.tickIndex-item.start-parseInt(studio.tickIndex/track.bars)*track.bars;

			switch(track.type){
				case "sequencer":
					track.channels.forEach(function(channel, channelIndex){
						if(channel.pattern && channel.pattern[trackTick] == 1) {
							studio.kit[channel.note].play();
						}
					})
					studio.sequencer.tick(trackTick);
					break;
				case "midi":
					var now = studio.actx.currentTime;
					track.events.forEach(function(event){
						if(parseInt(event.start/15) == trackTick){
							var evStart = event.start/15-parseInt(event.start/15)
							var evDuration = event.duration/15;
							studio.kit["P"].trigger(now+evStart, evDuration, event.note+event.octave);
						}
					})
					break;
			}
		}
	})

	if(this.sequencer){

	}
}

JSL.gui.Studio.prototype.load = function(data){
	this.song = _.cloneDeep(data);
	$("#bpm").val(this.song.bpm);
	this.sequencer.link(this.song.tracks[0]);
	this.pianoRoll.link(this.song.tracks[1]);
}

JSL.gui.Studio.prototype.init = function(){
	//iblokz.Element.prototype.init.call(this);

	var song = this.song;
	var sequencer = this.sequencer;
	var pianoRoll = this.pianoRoll;

	var playLoop = this.playLoop;
	var tickIndex = this.tickIndex;

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

		studio.tickIndex = -1;

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
