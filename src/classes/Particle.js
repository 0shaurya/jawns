import { Vector } from './Vector.js';
import { engine } from './../engine.js';

export class Particle {
	// Number id
	// Number x
	// Number y
	// Number radius
	// initialVelocity = { x, y }
	constructor(id, x, y, mass, radius, initialVelocity = { x: 0, y: 0 }, isBolted = false, isDeleted = false, color, isFollowing = false) {
		this.id = id;
		this.position = new Vector(x, y);
		this.velocity = new Vector(initialVelocity.x, initialVelocity.y);
		this.acceleration = new Vector(0, 0);
		this.mass = mass;
		this.radius = radius;

		this.isBolted = isBolted;
		this.isDeleted = isDeleted;
		this.stateHistory = [];
		this.color = color;
		this.isFollowing = isFollowing;

		// these properties are ONLY used for the updateVerlet method, as described on Wikipedia in the "Algorithmic representation" section.
		this.newPosition = new Vector(x, y);
		this.newVelocity = new Vector(initialVelocity.x, initialVelocity.y);
		this.newAcceleration = new Vector(0, 0);
	}

	// force: new Vector(x, y)
	applyForce(force) {
		this.acceleration.x += force.x / this.mass;
		this.acceleration.y += force.y / this.mass;
	}

	// Number dt
	update(dt) {
		// sets acceleration to gravitational acceleration
		let g = new Vector(0, 0);
		const negBigG = -6.6743e-11;
		engine.particles.forEach((item, index) => {
			if (item.id !== this.id && !item.isDeleted && item.mass !== 0) {
				let r = this.position.subtract(item.position);
				let rMag = r.magnitude();
				g = g.add(r.scale(negBigG * item.mass / (rMag**3)));
			}
		})
		this.acceleration = g;

		// updates velocity
		this.velocity = this.velocity.add(this.acceleration.scale(dt));
		
		// updates position
		if (!this.isBolted) this.position = this.position.add(this.velocity.scale(dt));
	}

	// update using Velocity Verlet integration. Clone of "Algorithmic representation" section in Wikipedia.
	// Number dt
	updateVerlet(dt) {

		// updates position	
		this.newPosition = this.position.add(this.velocity.scale(dt)).add(this.acceleration.scale(dt*dt*0.5));

		// sets acceleration to gravitational acceleration
		let g = new Vector(0, 0);

		const negBigG = -6.6743e-11;
		engine.particles.forEach((item, index) => {
			if (item.id !== this.id && !item.isDeleted && item.mass !== 0) {
				let r = this.position.subtract(item.position);
				let rMag = r.magnitude();
				g = g.add(r.scale(negBigG * item.mass / (rMag**3)));
			}
		})
		this.newAcceleration = g;

		// updates velocity
		this.newVelocity = this.velocity.add(this.acceleration.add(this.newAcceleration).scale(dt*0.5));

		this.position.x = this.newPosition.x;
		this.position.y = this.newPosition.y;
		this.velocity.x = this.newVelocity.x;
		this.velocity.y = this.newVelocity.y;
		this.acceleration.x = this.newAcceleration.x;
		this.acceleration.y = this.newAcceleration.y;
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