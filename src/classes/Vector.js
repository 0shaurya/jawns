export class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	
	add(vector) {
		return new Vector(this.x + vector.x, this.y + vector.y);
	}
	
	subtract(vector) {
		return new Vector(this.x - vector.x, this.y - vector.y);
	}

	scale(scalar) {
		return new Vector(this.x * scalar, this.y * scalar);
	}

	dot(vector) {
		return this.x * vector.x + this.y * vector.y; 
	}

	// calculates the k value of the cross product of this x arg
	crossK(vector) {
		return this.x * vector.y - this.y * vector.x;
	}

	magnitude() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}

	addScalar(scalar) {
		return this.scale((this.magnitude() + scalar) / this.magnitude());
	}

	// add in magnitude/direction form
	addMagnitudeDirection(magnitude, direction) {
		let vec2 = new Vector(magnitude * Math.cos(direction), magnitude * Math.sin(direction))
		return this.add(vec2)
	}

	normalize() {
		let mag = this.magnitude();
	    return new Vector(this.x / mag, this.y / mag); 
	}

	normalizeTo(f) {
		let mag = this.magnitude();
	    return new Vector(f * this.x / mag, f * this.y / mag); 
	}

	// returns angle in radians
	angle() {
    	return Math.atan2(this.y, this.x);
	}

	angleBetween(vector) {
		return Math.acos(this.dot(vector) / (this.magnitude() * vector.magnitude()));
	}
}