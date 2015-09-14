"use strict";


var context = new AudioContext;

var barIndex = -1;
var playLoop = false;

var durations = {
	"whole": 240,
	"half": 120,
	"quarter": 60,
	"eighth": 30,
	"sixteenth": 15,
}



var defaultSong = {
	name: "Song 1",
	bpm: 120,
	tracks: [
		{
			name: "Track 1",
			type: "sequencer",
			bars: 16,
			channels: [
				{
					name: "Channel 0",
					note: "K",
					pattern: [1,0,0,0,0,0,0,0]
				},
				{
					name: "Channel 1",
					note: "H",
					pattern: [0,0,1,0,0,0,1,0]
				},
				{
					name: "Channel 2",
					note: "S",
					pattern: [0,0,0,0,1,0,0,0]
				},
				{
					name: "Channel 3",
					note: "C"
				}
			]
		},
		{
			name: "Track 2",
			type: "midi",
			events: [
				{ 
					type: "noteon", 
					note: "C",
					start: 0,
					duration: durations.eighth 
				},
				{ 
					type: "noteon", 
					note: "E",
					start: durations.eighth,
					duration: durations.eighth 
				},
				{ 
					type: "noteon", 
					note: "C",
					start: durations.eighth*2,
					duration: durations.eighth 
				},
				{ 
					type: "noteon", 
					note: "E",
					start: durations.eighth*3,
					duration: durations.eighth 
				},
				{ 
					type: "noteon", 
					note: "G",
					start: durations.eighth*4,
					duration: durations.half 
				},
				{ 
					type: "noteon", 
					note: "E",
					start: durations.whole-durations.eighth,
					duration: durations.eighth 
				},
				{
					type: "noteon", 
					note: "G",
					start: durations.whole,
					duration: durations.eighth 
				},
				{ 
					type: "noteon", 
					note: "G",
					start: durations.whole+durations.eighth,
					duration: durations.eighth 
				},
				{ 
					type: "noteon", 
					note: "F",
					start: durations.whole+durations.eighth*2,
					duration: durations.eighth 
				},
				{ 
					type: "noteon", 
					note: "F",
					start: durations.whole+durations.eighth*3,
					duration: durations.eighth 
				},
				{ 
					type: "noteon", 
					note: "E",
					start: durations.whole+durations.eighth*4,
					duration: durations.half 
				}
			]
		}
	]
}

var song = {};

var kit = {
	K: new Sampler(context, "samples/kick01.ogg"),
	H: new Sampler(context, "samples/hihat_opened02.ogg"),
	S: new Sampler(context, "samples/snare01.ogg"),
	C: new Sampler(context, "samples/clap01.ogg"),
	"P": new Piano(context, "C5")
}

function playStep() {

	$(".bars").each(function(){
		$(this).find(".bar").eq(barIndex).removeClass("current");
	});

	if(barIndex < $("#bar-count").val()-1)
		barIndex++;
	else
		barIndex = 0;

	$(".bars").each(function(channelIndex){
		$(this).find(".bar").eq(barIndex).each(function(){
			$(this).addClass("current");
			if($(this).hasClass("selected")){
				kit[$("#channel"+channelIndex+" .channel-note").val()].play();
			}
		});		
	});

}

function updatePattern(){
	$(".bars").each(function(channelIndex){
		song.tracks[0].channels[channelIndex].pattern = [];
		$(this).find(".bar").each(function(barIndex){
			if($(this).hasClass("selected")){
				song.tracks[0].channels[channelIndex].pattern.push(1);
			} else {
				song.tracks[0].channels[channelIndex].pattern.push(0);
			}
		});
	});
}


function displayChannels(){
	var $channels = $(".sequencer .channels");
	$channels.html("");
	song.tracks[0].channels.forEach(function(channel, index){
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


function loadSong(data) {
	song = _.cloneDeep(data);
	$("#bpm").val(song.bpm);
	$("#bar-count").val(song.tracks[0].bars);
	displayChannels();
}


var grid = {
	step: [36,18],
	sections: [
		[4,16],
		[8]
	],
	color: "#333",
	sectionColors: [
		["#444",'#777'],
		["#444"]
	],
	backgrounds: [
		"#000","#111"
	],
	backgroundPattern: [
		1,1,0,1,0,1,0,1,1,0,1,0
	],
	labels: [
		"C","B","A#","A","G#","G","F#","F","E","D#","D","C#"
	],
	labelColor: "#555"
}


function drawLine(ctx, start, finish, dash, stroke){
	ctx.beginPath();
	ctx.moveTo(start[0],start[1]);
	ctx.lineTo(finish[0],finish[1]);
	//ctx.setLineDash(dash);
	context.lineWidth = 1;
	ctx.strokeStyle = stroke;
	ctx.stroke();
}

function drawRect(ctx, start, finish, background, stroke){
	ctx.beginPath();
	ctx.rect(start[0], start[1], finish[0], finish[1]);
	ctx.fillStyle = background;
	ctx.fill();
	if(stroke){
		context.lineWidth = 1;
		ctx.strokeStyle = stroke;
		ctx.stroke();
	}
}

function drawGrid(el, conf){
	var ctx = el.getContext("2d");

	ctx.canvas.width = $(ctx.canvas.parentNode).width();
	ctx.canvas.height = $(ctx.canvas.parentNode).height();

	var center = [ctx.canvas.width/2,ctx.canvas.height/2];
	var sizeVector = [ctx.canvas.width,ctx.canvas.height];

	

	var patternIndex = 0;

	for(var yPos = 0; yPos < sizeVector[1]; yPos += conf.step[1]){

		var backgroundColor = conf.backgrounds[conf.backgroundPattern[patternIndex]];
		var pianoBGColor = (conf.backgroundPattern[patternIndex] == 1) ?  "#999" : "#000";
		var pianoFGColor = (conf.backgroundPattern[patternIndex] == 1) ?  "#000" : "#999";

		//
		drawRect(ctx,  [0,yPos], [conf.step[0],yPos+conf.step[1]], pianoBGColor,"#000");

		drawRect(ctx,  [conf.step[0],yPos], [sizeVector[0],yPos+conf.step[1]], backgroundColor);

		ctx.font="16px Georgia";
		ctx.fillStyle=pianoFGColor;
		ctx.fillText(conf.labels[patternIndex],5,yPos-3+18);

		if(patternIndex < conf.backgroundPattern.length-1){
			patternIndex++;
		} else {
			patternIndex = 0;
		}

		var lineColor = conf.color;
		for(var section in conf.sections){
			if(parseInt(yPos/conf.step[1]/conf.sections[1][section]) == yPos/conf.step[1]/conf.sections[1][section]){
				lineColor = conf.sectionColors[1][section];
			}
		}
		drawLine(ctx, [conf.step[0],yPos], [sizeVector[0],yPos],null,lineColor);
	}

	// draw horizontal sectors
	for(var xPos = conf.step[0]; xPos < sizeVector[0]; xPos += conf.step[0]){
		var lineColor = conf.color;
		for(var section in conf.sections[0]){
			if(parseInt((xPos-conf.step[0])/conf.step[0]/conf.sections[0][section]) == (xPos-conf.step[0])/conf.step[0]/conf.sections[0][section]){
				lineColor = conf.sectionColors[0][section];
			}
		}
		drawLine(ctx, [xPos,0], [xPos,sizeVector[1]],null,lineColor);
	}
}

$(document).ready(function(){

	$(".workspace > *").draggable({
		containment: "parent",
		cursor: "crosshair",
		grid: [5,5],
		handle: ".toolbar"
	});

	drawGrid($(".piano-roll .grid")[0],grid);

	loadSong(defaultSong);

	$(".sequencer").on("click", ".bar", function(){
		$(this).toggleClass("selected");
		updatePattern();
	})


	$("#play").click(function(){
		if(playLoop) {
			clearInterval(playLoop);
			playLoop = false;
		} else {

			var bpm = parseInt($("#bpm").val());
			playLoop = setInterval(playStep, 60/bpm*1000/4);

			// play the second track
			song.tracks[1].events.forEach(function(event){
				kit["P"].trigger(context.currentTime+15/bpm+(event.start/bpm),event.duration/bpm,event.note+5)
			});
		}

		$(this).toggleClass("active");
	})

	$("#stop").click(function(){
		if(playLoop) {
			clearInterval(playLoop);
		}
		playLoop = false;
		$(".bars").each(function(){
			$(this).find(".bar").eq(barIndex).removeClass("current");
		});
		barIndex = -1;

		$("#play").removeClass("active");
	})


	$("#bpm").change(function(){
		song.bpm = $(this).val();
		if(playLoop) {
			clearInterval(playLoop);
			playLoop = setInterval(playStep, 60/$("#bpm").val()*1000/4);
		}
	})

	$("#bar-count").change(function(){
		song.tracks[0].bars = $(this).val();
		displayChannels();
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
			loadSong(data);
		}
	})

	$("#clear").click(function(){
		loadSong(defaultSong);
	})

})