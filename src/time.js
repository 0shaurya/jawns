import { renderFrame } from './renderer.js';
import { Particle } from './classes/Particle.js'
import { engine } from './engine.js';

import { State } from './classes/State.js';

import { updateFollowing } from './zoomingpanning.js';

let time = 0;
let isTimeMoving = false;

let timeSpeed = 1;
let simFPS = 1; // time step is equal to 1 divided by this number
let timeStep = 1/simFPS;

document.getElementById('timeSpeed').addEventListener('change', () => {
	timeSpeed = Math.max(0.01, document.getElementById('timeSpeed').value);
});

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

let frameTimeStart;
let frameTimeEnd;

function update() {
	let nextFrame = new State(time, engine.particles);
	
	if (isTimeMoving) {
		for (let i = 0; i < timeSpeed * simFPS / 60; i++) {
			nextFrame.time += timeStep;
	
			nextFrame.particles.forEach((item) => {
				if (!item.isDeleted) {
					item.update(timeStep);
				}
			});
		}
	
		engine.particles.forEach((item, index) => {
			item.position = nextFrame.particles[index].position;
			item.velocity = nextFrame.particles[index].velocity;
			item.acceleration = nextFrame.particles[index].acceleration;
		});
	}

	return nextFrame;
}

// renders a new frame every 1/60th seconds
function step() {
	frameTimeEnd = Date.now();
	document.getElementById("fps").textContent = "FPS: " + Math.min(1000/(frameTimeEnd - frameTimeStart), 60);
	document.getElementById("frametime").textContent = "Frametime: " + (frameTimeEnd - frameTimeStart) + "ms";
	document.getElementById("actualSimSpeed").textContent = "Actual Sim Speed: " + (Math.min(1000/(frameTimeEnd - frameTimeStart), 60)/60 * timeSpeed);
	frameTimeStart = Date.now();	
	
	updateFollowing();
	
	if (isTimeMoving) {

		let nextFrame = update();
		document.getElementById("time").textContent = `time: ${timeToString(time)}`;
		time += timeSpeed / 60;

		renderFrame(nextFrame);
		
		requestAnimationFrame(step);
	} else {
		let nextFrame = update();
		renderFrame(nextFrame);

		requestAnimationFrame(step);
	}
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
export { isTimeMoving };
