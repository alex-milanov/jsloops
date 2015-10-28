"use strict";

if(typeof iblokz === "undefined"){ var iblokz = {}; }

iblokz.Element = function(dom){

	this.dom = null;

	var htmlTags = [
		"div","span","p","ul","li","a","img",
		"table","tbody","tr","td","thead","th","tfoot",
		"form","input","select","button","textarea","label",
		"header","section","canvas"
	];

	switch( typeof dom){
		case "object":
			if( !!dom && dom instanceof HTMLElement){
				this.dom = dom;
			}
			break;
		case "string":
			if(htmlTags.indexOf(dom) > -1){
				this.dom = document.createElement(dom);
			} else {
				var selected = document.querySelector(dom);
				if(!!selected)
					this.dom = selected;
			}
			break;
	}

};

iblokz.Element.prototype.on = function(eventName, listener){
	this.dom.addEventListener(eventName, listener);
	return this;
}

iblokz.Element.prototype.append = function(target){
	this.dom.appendChild(target);
	return this;
}

iblokz.Element.prototype.appendTo = function(target){
	if (target instanceof iblokz.Element){
		target.append(this.dom);
	} else if (target instanceof HTMLElement){
		target.appendChild(this.dom);
	} else {
		return false;
	}

	return this;
}

iblokz.Element.prototype.find = function(selector){
	return this.dom.querySelectorAll(selector);
}

/*
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
*/