import { Particle } from './Particle.js';

export class State {
	// Number time
	// Array particles
	constructor(time, particles) {
		this.time = time;
		this.particles = [];
		particles.forEach((item, index) => {
			this.particles.push(new Particle(item.id, item.position.x, item.position.y, item.mass, item.charge, {x: item.velocity.x, y: item.velocity.y}, item.isBolted, item.isDeleted, item.color))
		})
	}
}