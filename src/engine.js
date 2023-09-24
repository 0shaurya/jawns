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

	getNumOfParticles: function() {
		let count = 0;
		this.particles.forEach((item, index) => {
			if (!item.isDeleted) {
				count += 1;
			}
		});

		return count;
	},

	calculateCollisions: function () {

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
	},

	// https://phys.libretexts.org/Bookshelves/Classical_Mechanics/Classical_Mechanics_(Dourmashkin)/25%3A_Celestial_Mechanics/25.04%3A_Energy_Diagram_Effective_Potential_Energy_and_Orbits
	// https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/mit8_01scs22_chapter25new.pdf
	calculateEffectivePotential: function(particle1, particle2) {
		let r = Math.abs(particle1.position.subtract(particle2.position).magnitude());
		let smallM = Math.min(particle1.mass, particle2.mass);
		let bigM = Math.max(particle1.mass, particle2.mass);
		let v = particle1.velocity.subtract(particle2.velocity).magnitude();
		const bigG = 6.6743e-11;
		let l = r * smallM * v;
		let mu = (smallM * bigM)/(smallM + bigM);

		return (l*l / (2 * mu * r * r)) - (bigG * smallM * bigM / r);
	},

	effectivePotentialMaxes: [],

	calculateEffectivePotentialMax: function(particle1, particle2) {
		let x = Math.max(particle1.id, particle2.id);
		let y = Math.min(particle1.id, particle2.id);

		if (this.effectivePotentialMaxes.length <= x) {
			let originalLength = this.effectivePotentialMaxes.length;
			this.effectivePotentialMaxes.length = x+1;
			this.effectivePotentialMaxes.fill([-Number.MAX_VALUE], originalLength);
		}

		if (this.effectivePotentialMaxes[x].length <= y) {
			let originalLength = this.effectivePotentialMaxes[x].length;
			this.effectivePotentialMaxes[x].length = y+1;
			this.effectivePotentialMaxes[x].fill(-Number.MAX_VALUE, originalLength);
		}
		this.effectivePotentialMaxes[x][y] = Math.max(this.effectivePotentialMaxes[x][y], this.calculateEffectivePotential(particle1, particle2));
		return this.effectivePotentialMaxes[x][y];
	},

	calculateEccentricity: function(particle1, particle2) {
		let bigE = this.calculateEffectivePotentialMax(particle1, particle2);
		if (bigE >= 0) return -1;

		let r = Math.abs(particle1.position.subtract(particle2.position).magnitude());
		let smallM = Math.min(particle1.mass, particle2.mass);
		let bigM = Math.max(particle1.mass, particle2.mass);
		let mu = (smallM * bigM)/(smallM + bigM);
		let v = particle1.velocity.subtract(particle2.velocity).magnitude();
		const bigG = 6.6743e-11;
		// let l  = r * Math.min(particle1.mass, particle2.mass) * v;
		let l = smallM * particle1.position.subtract(particle2.position).crossMagnitude(particle1.velocity.subtract(particle2.velocity))
		// console.log(l)
		console.log(l)

		// let l = 9e38

		return Math.sqrt(1 + ((2 * bigE * l * l) / (mu * (bigG * smallM * bigM)**2)))
	},

	// accidentally finds apsides instead of semi major/minor axes
	calculateOrbitLengths: function(particle1, particle2) {
		let bigE = this.calculateEffectivePotentialMax(particle1, particle2);
		if (bigE >= 0) return {apside1: null, apside2: null};

		let r = Math.abs(particle1.position.subtract(particle2.position).magnitude());
		let e = this.calculateEccentricity(particle1, particle2);
		let smallM = Math.min(particle1.mass, particle2.mass);
		let bigM = Math.max(particle1.mass, particle2.mass);
		let v = particle1.velocity.subtract(particle2.velocity).magnitude();
		let mu = (smallM * bigM)/(smallM + bigM);
		const bigG = 6.6743e-11;
		let l = r * smallM * v;

		if (e == 1) return {apside1: particle1.position.subtract(particle2.position).magnitude(),
							apside2: particle1.position.subtract(particle2.position).magnitude()}

		// let r0 = (l * l)/(bigG * bigM * mu * smallM);
		let r0 = -(bigG * smallM * bigM * (1 - e*e))/(2 * bigE)

		return {apside1: r0/(1-e), apside2: r0/(1+e)};
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

const mercury = {
	mass: 3.301e23,
	perihelion: 46e9,
	aphelion: 69.818e9,
	minSpeed: 38860,
	maxSpeed: 58970,
	radius: 2438300
}

const venus = {
	mass: 4.8673e24, 
	perihelion: 107.48e9,
	aphelion: 108.941e9,
	minSpeed: 34780,
	maxSpeed: 35260,
	radius: 6051800
};

const earth = {
	mass: 5.972168e24,
	perihelion: 147.095e9,
	aphelion: 152.100e9,
	minSpeed: 29290,
	maxSpeed: 30290,
	radius: 6371
};

const moon = {
	mass: 7.346e22,
	perigee: 3.6338e8,
	apogee: 4.055e8,
	minSpeed: 979,
	maxSpeed: 1082,
	radius: 272.7
};

const mars = {
	mass: 6.4169e23,
	perihelion: 206.65e9,
	aphelion: 249.261e9,
	minSpeed: 21970,
	maxSpeed: 26500,
	radius: 3389.5
}

const jupiter = {
	mass: 1898.13e24, 
	perihelion: 740.595e9,
	aphelion: 816.363e9,
	minSpeed: 12440,
	maxSpeed: 13720,
	radius: 69911000
}

const saturn = {
	mass: 568.32e24,
	perihelion: 1357.554e9, 
	aphelion: 1506.527e9,
	minSpeed: 9140,
	maxSpeed: 10140,
	radius: 58232000
}

const earthMass = 5.972168e24
const earthDist = 1.4961877e11
const AU = earthDist
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

engine.newParticle(mercury.perihelion, 0, mercury.mass, mercury.radius, {x:0, y:mercury.maxSpeed}, "silver");
engine.newParticle(venus.perihelion, 0, venus.mass, venus.radius, {x:0, y:venus.maxSpeed}, "purple");
engine.newParticle(moon.perigee + earth.perihelion, 0, moon.mass, moon.radius, {x:0, y:moon.maxSpeed + earth.maxSpeed}, "gray");
engine.newParticle(earth.perihelion, 0, earth.mass, earth.radius, {x:0, y:earth.maxSpeed}, "blue");
engine.newParticle(mars.perihelion, 0, mars.mass, mars.radius, {x:0, y:mars.maxSpeed}, "red");

engine.newParticle(jupiter.perihelion, 0, jupiter.mass, jupiter.radius, {x:0, y:jupiter.maxSpeed}, "orange");
engine.newParticle(saturn.perihelion, 0, saturn.mass, saturn.radius, {x:0, y:saturn.maxSpeed}, "beige");


// inclusive
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

// for (let i = 0; i < 100; i++) {
// 	let p = {x: randomInt(-AU, AU), y: randomInt(-AU, AU)}
// 	let v = {x: randomInt(-3000, 3000), y: randomInt(-3000, 3000)}
// 	let m = randomInt(plutoMass, earthMass)
// 	let r = Math.sqrt(m / Math.PI / 100000)
// 	engine.newParticle(p.x, p.y, m, r, v, "blue");
// }

export { engine };