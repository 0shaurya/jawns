import { Particle } from './classes/Particle.js' 

import { hPixelToActual } from './pixelActualConversions.js';
import { vPixelToActual } from './pixelActualConversions.js';
import { hActualToPixel } from './pixelActualConversions.js';
import { vActualToPixel } from './pixelActualConversions.js';

import { contextMenuCoords } from './contextMenu.js';

import { State } from './classes/State.js';

let newParticleButton = document.getElementById("newParticleContextMenuButton");
let newHeavyParticleButton = document.getElementById("newHeavyParticleContextMenuButton");

let engine = {
	particles: [],

	newParticle: function(x, y, mass, charge, initialVelocity, color) {
		this.particles.push(new Particle(
			this.particles.length,
			x,
			y,
			mass,
			charge,
			initialVelocity,
			false,
			false,
			color));
	},

	clearParticles: function() {
		this.particles = [];
	},
}

newParticleButton.addEventListener("click", () => {
	engine.newParticle(hPixelToActual(contextMenuCoords.x), vPixelToActual(contextMenuCoords.y), 1, 0, {x:0, y:0});
});

newHeavyParticleButton.addEventListener("click", () => {
	engine.newParticle(hPixelToActual(contextMenuCoords.x), vPixelToActual(contextMenuCoords.y), 100, 0, {x:0, y:0});
})

const sunMass = 1.988435e30

const mercuryMass = 3.301e23
const mercuryDist = 6.7828e10
const mercurySpeed = 47400

const venusMass = 4.867e24
const venusDist = 1.0892e11
const venusSpeed = 35000

const earthMass = 5.972168e24
const earthDist = 1.4961877e11
const earthSpeed = 29800

const moonMass = 7.3459e22
const moonDist = 3.85e8
const moonSpeed = 1020

const issMass = 450000
const issDist = 417500 + 6371000
const issSpeed = 7660

const marsMass = 6.4171e23
const marsDist = 2.4639e11
const marsSpeed = 24100

const phobosMass = 1.0659e16
const phobosDist = 9376000
const phobosSpeed = 2138

const jupiterMass = 1.898e27
const jupiterDist = 7.423e11
const jupiterSpeed = 13000

const saturnMass = 5.683e26
const saturnDist = 1.463e12
const saturnSpeed = 9640

const uranusMass = 8.681e25
const uranusDist = 2.9381e12
const uranusSpeed = 6800

const neptuneMass = 1.024e26
const neptuneDist = 4.4745e12
const neptuneSpeed = 5430

const plutoMass = 1.309e22
const plutoDist = 6.089e12
const plutoSpeed = 5365


engine.newParticle(0, 0, sunMass, 0, {x:0, y:0}, "yellow")

engine.newParticle(mercuryDist, 0, mercuryMass, 0, {x:0, y:mercurySpeed}, "silver");
engine.newParticle(venusDist, 0, venusMass, 0, {x:0, y:venusSpeed}, "purple");
engine.newParticle(earthDist, 0, earthMass, 0, {x:0, y:earthSpeed}, "blue");
engine.newParticle(earthDist + moonDist, 0, moonMass, 0, {x:0, y:earthSpeed + moonSpeed}, "gray");
engine.newParticle(marsDist, 0, marsMass, 0, {x:0, y:marsSpeed}, "red");

engine.newParticle(jupiterDist, 0, jupiterMass, 0, {x:0, y:jupiterSpeed}, "orange");
engine.newParticle(saturnDist, 0, saturnMass, 0, {x:0, y:saturnSpeed}, "beige");
engine.newParticle(uranusDist, 0, uranusMass, 0, {x:0, y:uranusSpeed}, "cyan");
engine.newParticle(neptuneDist, 0, neptuneMass, 0, {x:0, y:neptuneSpeed}, "blue");

engine.newParticle(plutoDist, 0, plutoMass, 0, {x:0, y:plutoSpeed}, "brown");

export { engine };