"use strict";

if(typeof JSL === "undefined"){ var JSL = {}; }
if(typeof JSL.etc === "undefined"){ JSL.etc = {}; }

JSL.etc.Counter = function(intervals, range, direction, position){
	// [12,1] in case of octaves -> tones
	// [4,4,1] measure -> beat -> tick
	this.intervals = intervals;
	this.range = range;
	this.direction = direction || 1;

	this.position = [];
	this.setPosition(position);

}

JSL.etc.Counter.prototype.setPosition = function(position){
	if(!position) {
		this.position = (this.direction == 1) ? this.range[0].slice() : this.range[1].slice();
	} else {
		this.position = position.slice();
	}
	return this;
}

JSL.etc.Counter.prototype.setPositionStart = function(){
	this.position = (this.direction == 1) ? this.range[0].slice() : this.range[1].slice();
	return this;
}

JSL.etc.Counter.prototype.setPositionEnd = function(){
	this.position = (this.direction == 1) ? this.range[1].slice() : this.range[0].slice();
	return this;
}

JSL.etc.Counter.prototype.fromSteps = function(steps){
	this.setPosition();
	this.iterate(steps)
	return this;
}

JSL.etc.Counter.prototype.toSteps = function(){
	var start = (this.direction == 1) ? this.range[0].slice() : this.range[1].slice();
	var steps = 0;
	for(var index = 0; index < this.position.length; index++){
		steps = (steps+(this.position[index]-start[index])*this.direction) * this.intervals[index];
	}
	return steps;
}

JSL.etc.Counter.prototype.iterate = function(steps, direction){
	if(typeof steps == undefined){
		steps = 1;
	}

	if(!direction){
		direction = this.direction;
	} else {
		// 1*1 = 1, 1*-1 = -1; -1 * 1 = -1; -1 * -1 = 1;
		direction *= this.direction;
	}

	for(var index = this.position.length-1; index >= 0 && steps > 0; index --){
		if(index > 0){
			var interval = this.intervals[index-1];
			var change = steps - parseInt(steps/interval)*interval;
			steps = parseInt(steps/interval); // for the next index

			this.position[index] += change*direction;

			if(direction == 1 && this.position[index] >= interval){
				steps++;
				this.position[index] -= interval;
			}
			if(direction == -1 && this.position[index] < 0){
				steps++;
				this.position[index] += interval;
			}

		} else {
			this.position[index] += direction*steps;
		}
	}
	return this;
}

JSL.etc.Counter.prototype.merge = function(counter, direction){
	this.iterate(counter.toSteps(), direction);
	return this;
}

JSL.etc.Counter.prototype.clone = function(){
	var counter = new JSL.etc.Counter(this.intervals,this.range,this.direction,this.position);
	return counter;
}


JSL.etc.Counter.prototype.copy = function(counter){
	this.intervals = counter.intervals;
	this.range = counter.range;
	this.direction = counter.direction;
	this.position = counter.position;
	return this;
}
