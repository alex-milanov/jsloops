"use strict";

if(!util)
	var util = {};


// Changes XML to JSON
util.xmlToJson = function(xml) {
	
	// Create the return object
	var obj = {};

	switch(xml.nodeType){
		case 1: // element
			if (xml.attributes.length > 0) {
				obj["@attributes"] = {};
				for (var j = 0; j < xml.attributes.length; j++) {
					var attribute = xml.attributes.item(j);
					var nodeValue = attribute.nodeValue;
					if(typeof(nodeValue) == "string"){
						if(/^\d+$/.test(nodeValue)){
							nodeValue = parseInt(nodeValue);
						} else if (/^\d+\.\d+$/.test(nodeValue)){
							nodeValue = parseFloat(nodeValue);
						}
					}
					obj["@attributes"][attribute.nodeName] = nodeValue;
				}
			}
			break;
		case 3: // text
			var trimmedNodeVal = xml.nodeValue.trim();
			obj = trimmedNodeVal;
			break;
		case 9: // root node
			obj = {}
			break;
		default: 
			obj = "";
			break;

	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			
			var nodeName = item.nodeName;
			var nodeValue = util.xmlToJson(item);
			if(nodeValue != ""){
				if (typeof(obj[nodeName]) == "undefined") {
					obj[nodeName] = nodeValue;
				} else {
					if (typeof(obj[nodeName].push) == "undefined") {
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					obj[nodeName].push(nodeValue);
				}
			}
		}
		if(typeof(obj) == "object" && Object.keys(obj).length == 1 && typeof(obj["#text"]) !== "undefined"){
			obj = obj["#text"];
		}
		if(typeof(obj) == "string"){
			if(/^\d+$/.test(obj)){
				obj = parseInt(obj);
			} else if (/^\d+\.\d+$/.test(obj)){
				obj = parseFloat(obj);
			}
		}
	}
	return obj;
};