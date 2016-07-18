'use strict';

class Vector2 {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	set(x, y) {
		this.x = x || this.x;
		this.y = y || this.y;

		return this;
	}

	toArray() {
		var coordArr = [];
		coordArr[0] = this.x;
		coordArr[1] = this.y;

		return coordArr;
	}

	fromArray(coordArr) {
		this.x = coordArr[0] || this.x;
		this.y = coordArr[1] || this.y;

		return this;
	}

	copy(v) {
		this.x = v.x || this.x;
		this.y = v.y || this.y;

		return this;
	}

	clone() {
		var newVector2 = new Vector2();
		newVector2.x = this.x;
		newVector2.y = this.y;
		return newVector2;
	}

	// TODO: Add vector operations
	add(v) {
		this.x += v.x;
		this.y += v.y;

		return this;
	}

	multiply(v) {
		this.x *= v.x;
		this.y *= v.y;

		return this;
	}

	multiplyScalar(s) {
		this.x *= s;
		this.y *= s;

		return this;
	}

	sub(v) {
		this.x -= v.x;
		this.y -= v.y;

		return this;
	}

	divide(v) {
		this.x /= v.x;
		this.y /= v.y;

		return this;
	}

	divideScalar(s) {
		this.x /= s;
		this.y /= s;

		return this;
	}

	// TODO: Add conversion from and to THREE.js Vector
	convertToThreeJSVector2(THREE) {
		if (THREE && THREE.Vector2) {
			var threeJSVector2 = new THREE.Vector2();
			threeJSVector2.x = this.x;
			threeJSVector2.y = this.y;

			return threeJSVector2;
		}
		return null;
	}
}

export default Vector2;
