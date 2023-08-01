import { Vector } from './Vector.js';
import { engine } from './../engine.js';

export class Particle {
	// Number id
	// Number x
	// Number y
	// Number charge
	// initialVelocity = { x, y }
	constructor(id, x, y, mass, charge, initialVelocity = { x: 0, y: 0 }, isBolted = false, isDeleted = false, color, isFollowing = false) {
		this.id = id;
		this.position = new Vector(x, y);
		this.velocity = new Vector(initialVelocity.x, initialVelocity.y);
		this.acceleration = new Vector(0, 0);
		this.mass = mass;
		this.charge = charge;

		this.isBolted = isBolted;
		this.isDeleted = isDeleted;
		this.stateHistory = [];
		this.color = color;
		this.isFollowing = isFollowing;
	}

	// force: new Vector(x, y)
	applyForce(force) {
		this.acceleration.x += force.x / this.mass;
		this.acceleration.y += force.y / this.mass;
	}

	// Number deltaTime
	update(deltaTime) {
		// updates velocity
		this.velocity = this.velocity.add(this.acceleration.scale(deltaTime));
		
		// updates position
		if (!this.isBolted) this.position = this.position.add(this.velocity.scale(deltaTime));


		// sets acceleration to gravitational acceleration
		let g = new Vector(0, 0);
		const negBigG = -6.6743e-11;
		engine.particles.forEach((item, index) => {
			if (item.id !== this.id && !item.id.isDeleted && item.mass !== 0) {
				let r = this.position.subtract(item.position);
				let rMag = r.magnitude();
				g = g.add(r.scale(negBigG * item.mass / (rMag**3)));
			}
		})
		this.acceleration = g;
	}

	toggleBolted() {
		this.isBolted = !this.isBolted;
	}

	delete() {
		this.isDeleted = true;
	}

	undelete() {
		this.isDeleted = false;
	}
}