"use strict";

if(typeof iblokz === "undefined"){ var iblokz = {}; }

iblokz.Element = function(dom, context){

	this._dom = dom;
	this._context = (typeof context === 'undefined') ? {} : context;

};

iblokz.Element.prototype.init = function(){

	var context = this._context;

	$(this._dom).on("click","[class*='-toggle']",function(){
		$(this).toggleClass("toggled");
		var $toggleRef = $($(this).data("toggle-ref"));
		var _toggleClass = $(this).data("toggle-class");
		var _toggleParam = $(this).data("toggle-param");
		$toggleRef.toggleClass(_toggleClass);
		if(_toggleParam !== ""){
			context.params[_toggleParam] = !context.params[_toggleParam];
		}
	});

	$(this._dom).on("click","[class*='-trigger']",function(){
		var _triggerMethod = $(this).data("trigger-method");
		if(typeof context[_triggerMethod] !== "undefined"){
			if($(this).data("trigger-id")){
				context[_triggerMethod]($(this).data("trigger-id"));
			} else {
				context[_triggerMethod]();
			}
		}
	});

	$(this._dom).on("click","[class*='-option']",function(_ev){
		$("a[class*='-option']").removeClass("selected");
		$(this).addClass("selected");

		var _optionParam = $(this).data("option-param");
		var _optionValue = $(this).data("option-value");

		context.params[_optionParam] = _optionValue;
	});

};