"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.data === "undefined"){ JSL.data = {}; }

JSL.data.ObjectIdCount = 0;

JSL.data.Object = function(data){
	Object.defineProperty( this, 'id', { value: JSL.data.ObjectIdCount ++ } );

	this.uuid = JSL.etc.Math.generateUUID();

	this.name = '';
	this.type = 'Object';

	this.parent = null;
	this.children = [];
}

JSL.data.Object.prototype = {

	constructor: JSL.data.Object,

	add: function (object) {
		if(object instanceof JSL.data.Object && object.parent == null && this.children.indexOf(object) === -1){
			this.children.push(object);
			object.parent = this;
		}

		return this;
	},

	remove: function(object) {
		if ( this.children.indexOf(object) !== - 1 ) {

			object.parent = null;

			object.dispatchEvent( { type: 'removed' } );

			this.children.splice( index, 1 );

		}

		return this;
	},

	duplicate: function(object) {
		this.add(object.clone());

		return this;
	},

	getObjectByName: function ( name ) {

		return this.getObjectByProperty( 'name', name );

	},

	getObjectByProperty: function ( name, value ) {

		if ( this[ name ] === value ) return this;

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			var child = this.children[ i ];
			var object = child.getObjectByProperty( name, value );

			if ( object !== undefined ) {

				return object;

			}

		}

		return undefined;

	},

	traverse: function ( callback ) {

		callback( this );

		var children = this.children;

		for ( var i = 0, l = children.length; i < l; i ++ ) {

			children[ i ].traverse( callback );

		}

	},

	traverseAncestors: function ( callback ) {

		var parent = this.parent;

		if ( parent !== null ) {

			callback( parent );

			parent.traverseAncestors( callback );

		}

	},

	toJSON: function(){
	},

	clone: function(object){
		object = object || new JSL.data.Object()
		object.name = this.name;
	}
}