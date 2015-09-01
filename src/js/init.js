"use strict";

$(document).ready(function(){

	$(".bar").click(function(){
		$(this).toggleClass("selected");
	})


	var barIndex = 0;

	$("#play").click(function(){

		$(".bar").eq(barIndex).removeClass("current");

		if(barIndex < 7)
			barIndex++;
		else
			barIndex = 0;

		$(".bar").eq(barIndex).addClass("current");
	})

})