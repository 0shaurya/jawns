import { engine }  from './engine.js';
import { Vector }  from './classes/Vector.js';

import { hActualToPixel, hPixelToActual, vActualToPixel, vPixelToActual } from './pixelActualConversions.js';
import { gridStep } from './renderer.js';

const canvas = document.getElementById("canv");

// x_test, y_test: position of point to calculate Grav force at
// x, y: position of object grav force is exerted from
// mass: mass of object grav force is exerted from
function calculateGravitationalForceAtPoint(x_test, y_test, mass, x, y) {
	let vecTest = new Vector(x_test, y_test);
	let vecObject = new Vector(x, y);
	let vecDiff = vecTest.subtract(vecObject);
	let diff = vecTest.subtract(vecObject).magnitude();
	return vecDiff.scale(-1 * 6.67430 * mass / (diff**3) );
}

function calculateGravitationalFieldAtPoint(x, y) {
	let temp = new Vector(0, 0);
	engine.particles.forEach((item, index) => {
		temp = temp.add(calculateGravitationalForceAtPoint(x, y, item.mass, item.position.x, item.position.y));
	})
	return temp;
}

function calculateGravitationalFieldAtPointExcludingAParticle(x, y, particleID) {
	let temp = new Vector(0, 0);
	engine.particles.forEach((item, index) => {
		if (particleID !== item.id) temp = temp.add(calculateGravitationalForceAtPoint(x, y, item.mass, item.position.x, item.position.y));
	})
	return temp;
}

export { calculateGravitationalForceAtPoint };
export { calculateGravitationalFieldAtPoint };
export { calculateGravitationalFieldAtPointExcludingAParticle };