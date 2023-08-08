import { renderFrame } from './renderer.js';
import { Particle } from './classes/Particle.js'
import { engine } from './engine.js';

import { State } from './classes/State.js';

import { updateFollowing } from './zoomingpanning.js';

function timeToString(seconds) {
	let ms = Math.floor(seconds * 1000);

	let years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365.25636));
	ms -= years * (1000 * 60 * 60 * 24 * 365.25636);

	let days = Math.floor(ms / (1000 * 60 * 60 * 24)); 
	ms -= days * (1000 * 60 * 60 * 24);

	let hours = Math.floor(ms / (1000 * 60 * 60));
	ms -= hours * (1000 * 60 * 60); 

	let minutes = Math.floor(ms / (1000 * 60));
	ms -= minutes * (1000 * 60);

	let sec = Math.floor(ms / 1000);
	ms -= sec * 1000;

	return `${years}y ${days}d ${hours}h ${minutes}m ${sec}s ${Math.round(ms)}ms`;
}

function stringToTime(duration) {
	const regex = /^(\d*\.?\d*)(.*)/; 
	const [_, nums, units='s'] = duration.match(regex);
	const number = parseFloat(nums);
	let seconds;

	switch(units) {
		case 's':
			seconds = number;
			break;
		case 'm': 
			seconds = number * 60;
			break;
		case 'h':
			seconds = number * 60 * 60;
			break;  
		case 'd':
			seconds = number * 60 * 60 * 24;
			break;
		case 'y':
			seconds = number * 60 * 60 * 24 * 365.25636; 
			break;
		default:
			seconds = number;
			break;
	}
	
	return seconds;
}


let time = 0;
let isTimeMoving = false;

document.getElementById('timeSpeed').addEventListener('change', () => {
	timeSpeed = Math.max(0.01, stringToTime(document.getElementById('timeSpeed').value));
});

document.getElementById('timeStep').addEventListener('change', () => {
	timeStep = Math.max(0, stringToTime(document.getElementById('timeStep').value));
	simFPS = 1/timeStep;
});

let timeSpeed = Math.max(0.01, stringToTime(document.getElementById('timeSpeed').value));
let timeStep = Math.max(0, stringToTime(document.getElementById('timeStep').value));
let simFPS = 1/timeStep;

let frameTimeStart;
let frameTimeEnd;

let particlePerformanceArray = [];


function update() {
	let nextFrame = new State(time, engine.particles);

	if (isTimeMoving) {

		let updatingPhysicsStart = performance.now();
		
		for (let i = 0; i < Math.round(timeSpeed / timeStep) / 60; i++) {
			nextFrame.time += timeStep;
			nextFrame.particles.forEach((item) => {
				if (!item.isDeleted) item.updateVerlet(timeStep);
			});
		}

		let updatingPhysicsTime = performance.now() - updatingPhysicsStart;
		document.getElementById("updatingPhysicsTime").textContent = `___Updating Physics Time: ${updatingPhysicsTime} ms`;
		
		let collisionsStart = performance.now();
		engine.calculateCollisions();
		let collisionsTime = performance.now() - collisionsStart;
		document.getElementById("collisionsTime").textContent = `___Calculating Collisions Time: ${collisionsTime} ms`;

		let updatingValsStart = performance.now();
		engine.particles.forEach((item, index) => {
			item.position = nextFrame.particles[index].position;
			item.velocity = nextFrame.particles[index].velocity;
			item.acceleration = nextFrame.particles[index].acceleration;
		});

		let updatingValsTime = performance.now() - updatingValsStart;
		document.getElementById("updatingValsTime").textContent = `___Updating Values Time: ${updatingValsTime} ms`;

		let sun = engine.particles[0]
		let mercury = engine.particles[1]

		//document.getElementById("effectivePotentials").innerHTML = JSON.stringify({
		//	mercurySun: engine.calculateEccentricity(engine.particles[0], engine.particles[1]),
		//	earthSun: engine.calculateEccentricity(engine.particles[0], engine.particles[3]),
		//	moonSun: engine.calculateEccentricity(engine.particles[0], engine.particles[4]),
		//	earthMoon: engine.calculateEccentricity(engine.particles[4], engine.particles[3]),
		//	moonJupiter: engine.calculateEccentricity(engine.particles[4], engine.particles[6]),
		//	venusNeptune: engine.calculateEccentricity(engine.particles[2], engine.particles[9]),
		//	sunNeptune: engine.calculateEccentricity(engine.particles[0], engine.particles[9])
		//})

		// let hasParticles = false;
		// particlePerformanceArray.forEach((item, index) => {
		// 	if (item.numOfParticles === engine.getNumOfParticles()) {
		// 		hasParticles = true;
		// 	}
		// })
		// 
		// if (!hasParticles) {
		// 	particlePerformanceArray.push({
		// 		numOfParticles: engine.getNumOfParticles(),
		// 		updatingPhysicsTime: updatingPhysicsTime,
		// 		collisionsTime: collisionsTime,
		// 		updatingValsTime: updatingValsTime,
		// 		totalTime: updatingPhysicsTime + collisionsTime + updatingValsTime
		// 	})	
		// }


	}
	// console.log(particlePerformanceArray);

	return nextFrame;
}

// renders a new frame every 1/60th seconds
function step() {

	frameTimeEnd = performance.now();
	document.getElementById("fps").textContent = "FPS: " + Math.round(Math.min(1000/(frameTimeEnd - frameTimeStart), 60));
	document.getElementById("frametime").textContent = "Frametime: " + (frameTimeEnd - frameTimeStart) + "ms";
	document.getElementById("actualSimSpeed").textContent = "Actual Sim Speed: " + timeToString(Math.min(1000/(frameTimeEnd - frameTimeStart), 60)/60 * timeSpeed);
	let tempFrameTimeStart = frameTimeStart;
	frameTimeStart = performance.now();   
	
	let updateFollowingStart = performance.now();
	updateFollowing();
	document.getElementById("followingTime").textContent = "Updating Following Time: " + (performance.now() -  updateFollowingStart) + "ms";

	let nextFrameStart = performance.now();
	let nextFrame = update();
	document.getElementById("updatingTime").textContent = "Total Updating Time: " + (performance.now() -  nextFrameStart) + "ms";

	if (isTimeMoving) {
		document.getElementById("time").textContent = `time: ${timeToString(time)}`;
		time += timeSpeed * Math.min((frameTimeEnd - tempFrameTimeStart)/1000, 1/60)
	}

	let renderingTimeStart = performance.now();
	renderFrame(nextFrame);
	document.getElementById("renderingTime").textContent = "Rendering Time: " + (performance.now() - renderingTimeStart) + "ms";

	window.requestAnimationFrame(step);
}

function reset() {
	time = 0;

	engine.particles = engine.stateHistoryArray[0].particles;

	engine.stateHistoryArray.length = 1;
	update();
}

function pauseplay() {
	if (isTimeMoving) {
		isTimeMoving = false;
	} else {
		isTimeMoving = true;
		step();
	}
}

function seek() {
	let seekTime = prompt("Seek time in seconds");
	let seekNum = Math.round(seekTime * 60);

	time = engine.stateHistoryArray[seekNum].time;

	engine.particles = engine.stateHistoryArray[seekNum].particles;
	
	document.getElementById("time").textContent = `time: ${Math.round(time*1000)/1000}`;
	update();

	engine.stateHistoryArray = engine.stateHistoryArray.splice(0, seekNum);
}

document.getElementById("reset").addEventListener("click", reset);
document.getElementById("pauseplay").addEventListener("click", pauseplay);
document.getElementById("seek").addEventListener("click", seek);

setTimeout(step(), 100);

export { time };
export { timeToString };
export { timeStep };
export { isTimeMoving };