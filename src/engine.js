import { Particle } from './classes/Particle.js' 

import { hPixelToActual } from './pixelActualConversions.js';
import { vPixelToActual } from './pixelActualConversions.js';
import { hActualToPixel } from './pixelActualConversions.js';
import { vActualToPixel } from './pixelActualConversions.js';

import { contextMenuCoords } from './contextMenu.js';

import { State } from './classes/State.js';

import { time } from './time.js';
import { timeToString } from './time.js';

import { Vector } from './classes/vector.js';

let newParticleButton = document.getElementById("newParticleContextMenuButton");
let newHeavyParticleButton = document.getElementById("newHeavyParticleContextMenuButton");

let engine = {
	particles: [],

	newParticle: function(x, y, mass, radius, initialVelocity, color) {
		this.particles.push(new Particle(
			this.particles.length,
			x,
			y,
			mass,
			radius,
			initialVelocity,
			false,
			false,
			color));
	},

	clearParticles: function() {
		this.particles = [];
	},

	calculateCollisions: function () {
		
		// // create a new array 'xs' which is the array of all particles sorted by their x positions
		// let xs = this.particles.toSorted((a, b) => {
		// 	return a.position.x - b.position.x;
		// });
		// // loop through 'xs' array
		// for (let i = 0; i < xs.length - 1; i++) {
		// 	
		// 	// check if the ith and (i+1)th particle is close enough to be touching in the x-direction			
		// 	if ((xs[i+1].position.x - xs[i].position.x) < (xs[i].radius + xs[i+1].radius) && (!xs[i].isDeleted) && (!xs[i+1].isDeleted)) {
		// 		
		// 		// now that we know they are touching in the x-direction, check if they are touching in the y direction
		// 		if ((xs[i+1].position.y - xs[i].position.y) < (xs[i].radius + xs[i+1].radius)) {
		// 			
		// 			// absorb the particle depending on which particle is bigger
		// 			if (xs[i].mass > xs[i+1].mass) {
		// 				engine.particles[xs[i].id].mass += xs[i+1].mass;
		// 				engine.particles[xs[i].id].radius = Math.sqrt((engine.particles[xs[i].id].radius)**2 + ((engine.particles[xs[i+1].id].radius))**2)
		// 				
		// 				console.log(`[${timeToString(time)}] ${xs[i].id} swallowed ${xs[i].id}`);
		// 				
		// 				engine.particles[i+1].delete();
		// 			} else {
		// 				engine.particles[xs[i+1].id].mass += xs[i].mass;
		// 				engine.particles[xs[i+1].id].radius = Math.sqrt((engine.particles[xs[i].id].radius)**2 + ((engine.particles[xs[i+1].id].radius))**2)
		// 				
		// 				console.log(`[${timeToString(time)}] ${xs[i+1].id} swallowed ${xs[i].id}`);
		// 				
		// 				engine.particles[i].delete();
		// 			}
		// 		}
		// 	}
		// }

		engine.particles.forEach((item, index) => {
			engine.particles.forEach((jtem, jndex) => {
				if (item.id !== jtem.id && !item.isDeleted && !jtem.isDeleted && item.position.subtract(jtem.position).magnitude() < item.radius+jtem.radius) {
					if (item.mass > jtem.mass) {
						item.mass += jtem.mass;
						item.radius = Math.sqrt((item.radius)**2 + ((jtem.radius))**2)
						
						console.log(`[${timeToString(time)}] ${item.id} swallowed ${jtem.id}`);
						
						jtem.delete();
					} else {
						jtem.mass += item.mass;
						jtem.radius = Math.sqrt((item.radius)**2 + ((jtem.radius))**2)
						
						console.log(`[${timeToString(time)}] ${jtem.id} swallowed ${item.id}`);
						
						item.delete();
					}
				}
			})
		});	
	}
}

newParticleButton.addEventListener("click", () => {
	engine.newParticle(hPixelToActual(contextMenuCoords.x), vPixelToActual(contextMenuCoords.y), 1, 0, {x:0, y:0});
});

newHeavyParticleButton.addEventListener("click", () => {
	engine.newParticle(hPixelToActual(contextMenuCoords.x), vPixelToActual(contextMenuCoords.y), 100, 0, {x:0, y:0});
})

const sunMass = 1.988435e30
const sunRadius = 6.957e8

const mercuryMass = 3.301e23
const mercuryDist = 6.7828e10
const mercurySpeed = 47400
const mercuryRadius = 2.44e6

const venusMass = 4.867e24
const venusDist = 1.0892e11
const venusSpeed = 35000
const venusRadius = 6.05e6

const earthMass = 5.972168e24
const earthDist = 1.4961877e11
const earthSpeed = 29800
const earthRadius = 6.371009e6

const moonMass = 7.3459e22
const moonDist = 3.85e8
const moonSpeed = 1020
const moonRadius = 1.7374e6

const issMass = 450000
const issDist = 417500 + earthRadius
const issSpeed = 7660

const marsMass = 6.4171e23
const marsDist = 2.4639e11
const marsSpeed = 24100
const marsRadius = 3.39e6

const phobosMass = 1.0659e16
const phobosDist = 9376000
const phobosSpeed = 2138
const phobosRadius = 1.108e4

const jupiterMass = 1.898e27
const jupiterDist = 7.423e11
const jupiterSpeed = 13000
const jupiterRadius = 6.995e7

const saturnMass = 5.683e26
const saturnDist = 1.463e12
const saturnSpeed = 9640
const saturnRadius = 5.83e7

const uranusMass = 8.681e25
const uranusDist = 2.9381e12
const uranusSpeed = 6800
const uranusRadius = 2.536e7

const neptuneMass = 1.024e26
const neptuneDist = 4.4745e12
const neptuneSpeed = 5430
const neptuneRadius = 2.46e7

const plutoMass = 1.309e22
const plutoDist = 6.089e12
const plutoSpeed = 5365
const plutoRadius = 1.1899e6


engine.newParticle(0, 0, sunMass, sunRadius, {x:0, y:0}, "yellow")

// engine.newParticle(mercuryDist, 0, mercuryMass, 0, {x:0, y:mercurySpeed}, "silver");
// engine.newParticle(venusDist, 0, venusMass, 0, {x:0, y:venusSpeed}, "purple");
//engine.newParticle(earthDist, 0, earthMass, 0, {x:0, y:earthSpeed}, "blue");
// engine.newParticle(earthDist + moonDist, 0, moonMass, 0, {x:0, y:earthSpeed + moonSpeed}, "gray");
// engine.newParticle(marsDist, 0, marsMass, 0, {x:0, y:marsSpeed}, "red");

// engine.newParticle(jupiterDist, 0, jupiterMass, 0, {x:0, y:jupiterSpeed}, "orange");
// engine.newParticle(saturnDist, 0, saturnMass, 0, {x:0, y:saturnSpeed}, "beige");
// engine.newParticle(uranusDist, 0, uranusMass, 0, {x:0, y:uranusSpeed}, "cyan");
// engine.newParticle(neptuneDist, 0, neptuneMass, 0, {x:0, y:neptuneSpeed}, "blue");
// 
// engine.newParticle(plutoDist, 0, plutoMass, 0, {x:0, y:plutoSpeed}, "brown");

// inclusive
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

// for (let i = 0; i < 100; i++) {
// 	let p = {x: randomInt(-100, 100), y: randomInt(-100, 100)}
// 	let v = {x: 2*(Math.random() - 0.5), y: 2*(Math.random() - 0.5)}
// 	let m = randomInt(1, 10)
// 	let r = Math.sqrt(m)
// 	engine.newParticle(p.x, p.y, m, r, {x: v.x, y: v.y}, "blue");
// }

for (let i = 0; i < 100; i++) {
	let p = {x: randomInt(-plutoDist, plutoDist), y: randomInt(-plutoDist, plutoDist)}
	let v = {x: randomInt(-plutoSpeed/100, plutoSpeed/100), y: randomInt(-plutoSpeed/100, plutoSpeed/100)}
	let m = randomInt(plutoMass/100, plutoMass)
	let r = plutoRadius
	engine.newParticle(p.x, p.y, m, 100*r, {x: v.x, y: v.y}, "white");
}

export { engine };