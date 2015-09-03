"use strict";


var context = new AudioContext;

var barIndex = -1;
var playLoop = false;


var tracks = [
	{
		name: "Track 0",
		note: "K",
		pattern: [1,0,0,0]
	},
	{
		name: "Track 1",
		note: "H",
		pattern: [0,1,0,1]
	},
	{
		name: "Track 2",
		note: "S",
		pattern: [0,0,1,0]
	},
	{
		name: "Track 3",
		note: "C"
	},
	{
		name: "Track 4",
		note: "P,C"
	},
	{
		name: "Track 5",
		note: "P,F"
	},
	{
		name: "Track 6",
		note: "P,G"
	}
]


var kit = {
	K: new Sampler(context, "samples/kick01.ogg"),
	H: new Sampler(context, "samples/hihat_opened02.ogg"),
	S: new Sampler(context, "samples/snare01.ogg"),
	C: new Sampler(context, "samples/clap01.ogg"),
	"P,C": new Piano(context, "C5"),
	"P,F": new Piano(context, "F5"),
	"P,G": new Piano(context, "G5"),
}

function playStep() {


	$(".bars").each(function(){
		$(this).find(".bar").eq(barIndex).removeClass("current");
	});

	if(barIndex < $("#bar-count").val()-1)
		barIndex++;
	else
		barIndex = 0;

	$(".bars").each(function(trackIndex){
		$(this).find(".bar").eq(barIndex).each(function(){
			$(this).addClass("current");
			if($(this).hasClass("selected")){
				kit[$("#track"+trackIndex+" .track-note").val()].play();
			}
		});		
	});

}

function displayTracks(){
	var $tracks = $(".sequencer .tracks");
	$tracks.html("");
	tracks.forEach(function(track, index){
		var $track = $("<div></div>").addClass("track").attr("id","track"+index);
		$track.append($("<div></div>").addClass("track-name").html(track.name));
		$track.append($("<input></input>").addClass("track-note").val(track.note));
		var $bars = $("<div></div>").addClass("bars");


		var patternIndex = 0;
		for(var bar = 0; bar < $("#bar-count").val(); bar++){
			var $bar = $("<div></div>").addClass("bar").attr("id","track"+index+"-bar"+bar);
			if(track.pattern){
				if(track.pattern[patternIndex] == 1){
					$bar.addClass("selected");
				}
				if(patternIndex < track.pattern.length-1){
					patternIndex++;
				} else {
					patternIndex = 0;
				}
			}
			$bars.append($bar);
				
		}
		$track.append($bars);
		$tracks.append($track);
	})
}

$(document).ready(function(){

	displayTracks();

	$(".sequencer").on("click", ".bar", function(){
		$(this).toggleClass("selected");
	})


	$("#play").click(function(){
		if(playLoop) {
			clearInterval(playLoop);
			playLoop = false;
		} else {
			playLoop = setInterval(playStep, 60/$("#bpm").val()*1000/2);
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
		if(playLoop) {
			clearInterval(playLoop);
			playLoop = setInterval(playStep, 60/$("#bpm").val()*1000/2);
		}
	})

	$("#bar-count").change(function(){
		displayTracks();
	})

})