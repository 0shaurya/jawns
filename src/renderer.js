import { engine } from './engine.js';
import { translateX } from './zoomingpanning.js';
import { translateY } from './zoomingpanning.js';
import { scale } from './zoomingpanning.js';
import { gridlinesOn } from './toolbar.js';
import { gravField } from './toolbar.js';

import { hPixelToActual } from './pixelActualConversions.js';
import { vPixelToActual } from './pixelActualConversions.js';
import { hActualToPixel } from './pixelActualConversions.js';
import { vActualToPixel } from './pixelActualConversions.js';

import { calculateGravitationalForceAtPoint } from './gravitationalField.js';
import { calculateGravitationalFieldAtPoint } from './gravitationalField.js';
import { calculateGravitationalFieldAtPointExcludingAParticle } from './gravitationalField.js';

import { mousePosition } from './zoomingpanning.js';

import { Vector } from './classes/Vector.js';

const canvas = document.getElementById("canv");
const ctx = canvas.getContext("2d");

let gridStep;

function drawBall(x, y, r, color, alpha = 1) {
	ctx.beginPath();
	ctx.arc(hActualToPixel(x), vActualToPixel(y), r, 0, 2 * Math.PI);
	ctx.strokeStyle = color;
	ctx.globalAlpha = alpha;
	ctx.fillStyle = color;
	ctx.fill();
	ctx.stroke();
}

function drawOrbit(particle1, particle2, color, alpha = 1) {
	let f;

	if (particle1.mass > particle2.mass) {
		f = new Vector(particle1.position.x, particle1.position.y);
	} else {
		f = new Vector(particle2.position.x, particle2.position.y);
	}


	let ap1 = engine.calculateOrbitLengths(particle1, particle2).apside1;
	let ap2 = engine.calculateOrbitLengths(particle1, particle2).apside2;

	let a = (ap1 + ap2) / 2;
	let b = Math.sqrt(ap1 * ap2);
	let c = f.addScalar(-Math.sqrt(a*a - b*b));

	ctx.strokeStyle = color;
	ctx.beginPath()
	ctx.ellipse(hActualToPixel(c.x), vActualToPixel(c.y), Math.abs(hActualToPixel(a) - hActualToPixel(0)), Math.abs(vActualToPixel(b)-vActualToPixel(0)), -particle1.position.angleBetween(particle2.position), 0, 2*Math.PI)
	ctx.stroke();
}

// xf, yf: x from, y from
// xt, yt: x to, y to
function drawArrow(xf, yf, xt, yt, color, alpha = 1) {
	if (alpha > 0) {
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.globalAlpha = alpha;
		
		ctx.beginPath();
		ctx.moveTo(hActualToPixel(xf), vActualToPixel(yf));
		ctx.lineTo(hActualToPixel(xt), vActualToPixel(yt));
		ctx.arc(hActualToPixel(xt), vActualToPixel(yt), 1, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
	}
}

function drawFieldTriangle(x, y, angle, color, alpha = 1) {
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.globalAlpha = alpha;
	ctx.lineWidth = 1;

	let xp = hActualToPixel(x);
	let yp = vActualToPixel(y);

	let a = angle;

	ctx.beginPath();
	ctx.moveTo(xp, yp);
	ctx.lineTo(xp-4*Math.sin(a),  yp-4*Math.cos(a));
	ctx.lineTo(xp+10*Math.cos(a), yp-10*Math.sin(a));
	ctx.lineTo(xp+4*Math.sin(a),  yp+4*Math.cos(a));
	ctx.lineTo(xp, yp);
	ctx.stroke();
	ctx.fill();
}

function roundUpNearest(value, nearest) {
	return Math.ceil(value/nearest) * nearest;
}

function generateGridlineText(value, gridStep) {
	if (value > -0.00001 && value < 0.00001) {
		return 0;
	}

	if (gridStep >= 1 && gridStep < 10000) {
		return Number(value.toFixed(0));
	} else if (gridStep >= 0.0001 && gridStep < 1) {
		return Number(value.toFixed(5));
	} else {
		return value.toExponential(0);
	}
}

function drawGridlines() {
	ctx.strokeStyle = "#ffffff";
	ctx.lineWidth = 1;
	ctx.globalAlpha = 1;
	gridStep = 4/scale;

	let gridStepSciNot = {};
	[gridStepSciNot.c, gridStepSciNot.e] = gridStep.toExponential().split('e').map(item => Number(item));
	if (gridStepSciNot.c < 1.5) {
		gridStep = 1 * 10 ** gridStepSciNot.e;
	} else if (1.5 <= gridStepSciNot.c  && gridStepSciNot.c < 3.5) {
		gridStep = 2 * 10 ** gridStepSciNot.e;
	} else if (3.5 <= gridStepSciNot.c && gridStepSciNot.c < 7.5) {
		gridStep = 5 * 10 ** gridStepSciNot.e;
	} else if (gridStepSciNot.c >= 7.5) {
		gridStep = 10 * 10 ** gridStepSciNot.e;
	}

	let i;

	// vertical lines
	i = hActualToPixel(roundUpNearest(hPixelToActual(32), gridStep));
	while (i <= canvas.width && i >= 32) {
		ctx.lineWidth = (hPixelToActual(i).toFixed(1) == 0) ? 3 : 1;
		
		ctx.beginPath();
		ctx.moveTo(i+.5, 0);
		ctx.lineTo(i+.5, canvas.height - 32);
		ctx.stroke();
		ctx.closePath();

		i += hActualToPixel(gridStep) - hActualToPixel(0);
	}

	// horizontal lines
	i = vActualToPixel(roundUpNearest(vPixelToActual(canvas.height-32), gridStep));
	while (i <= canvas.height - 32 && i >= 0) {
		ctx.lineWidth = (vPixelToActual(i).toFixed(1) == 0) ? 3 : 1;
		
		ctx.beginPath();
		ctx.moveTo(32, i+.5);
		ctx.lineTo(canvas.width, i+.5);
		ctx.stroke();
		ctx.closePath();

		i += vActualToPixel(gridStep) - vActualToPixel(0);
	}
}

function drawGridNumbers() {
	ctx.strokeStyle = "#ffffff";
	ctx.lineWidth = 1;
	ctx.globalAlpha = 1;
	gridStep = 4/scale;

	let gridStepSciNot = {};
	[gridStepSciNot.c, gridStepSciNot.e] = gridStep.toExponential().split('e').map(item => Number(item));
	if (gridStepSciNot.c < 1.5) {
		gridStep = 1 * 10 ** gridStepSciNot.e;
	} else if (1.5 <= gridStepSciNot.c  && gridStepSciNot.c < 3.5) {
		gridStep = 2 * 10 ** gridStepSciNot.e;
	} else if (3.5 <= gridStepSciNot.c && gridStepSciNot.c < 7.5) {
		gridStep = 5 * 10 ** gridStepSciNot.e;
	} else if (gridStepSciNot.c >= 7.5) {
		gridStep = 10 * 10 ** gridStepSciNot.e;
	}

	ctx.fillStyle = "black";    
	ctx.fillRect(0, 0, 32, canvas.height);
	ctx.fillRect(0, canvas.height-32, canvas.width, 32);

	// lines that seperate numbers from grid
	ctx.beginPath();
	ctx.moveTo(32.5, 0);
	ctx.lineTo(32.5, canvas.height - 32);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo(32, canvas.height - 32.5);
	ctx.lineTo(canvas.width, canvas.height - 32.5);
	ctx.stroke();
	ctx.closePath();

	let i;
	ctx.font = "12px Arial";
	ctx.textAlign = "center"; 
	ctx.fillStyle = "white";

	// vertical lines
	i = hActualToPixel(roundUpNearest(hPixelToActual(32), gridStep));
	while (i <= canvas.width && i >= 32) {
		ctx.fillText(generateGridlineText(hPixelToActual(i), gridStep), i, canvas.height - 10);

		i += hActualToPixel(gridStep) - hActualToPixel(0);
	}

	// horizontal lines
	i = vActualToPixel(roundUpNearest(vPixelToActual(canvas.height-32), gridStep));
	while (i <= canvas.height - 32 && i >= 0) {
		ctx.fillText(generateGridlineText(vPixelToActual(i), gridStep), 15, i+6); 

		i += vActualToPixel(gridStep) - vActualToPixel(0);
	}

	ctx.fillStyle = "black";
	ctx.fillRect(0, canvas.height - 32, 32, 32)
}

function drawGravField() {
	let color;
	let temp;
	for (let i = hPixelToActual(0); i < Math.ceil(hPixelToActual(canvas.width)); i += 2/scale) {
		for (let j = vPixelToActual(canvas.height); j < Math.ceil(vPixelToActual(0)); j += 2/scale) {
			temp = calculateGravitationalFieldAtPoint(i, j);
			color = Math.min(Math.max((100 * temp.magnitude()), 0), 255);
			drawFieldTriangle(i, j, temp.angle(), `hsl(${color} 100% 50%)`, 1);
		}
	}
}

let shiftKeyDown = false;

document.addEventListener("keydown", (e) => {
	if (e.shiftKey) shiftKeyDown = true;
})

document.addEventListener("keyup", (e) => {
	if (!e.shiftKey) shiftKeyDown = false;
})

// takes in a State object to determine what to render
function renderFrame(frame) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (gridlinesOn) drawGridlines();

	if (gravField) drawGravField();

	if (shiftKeyDown) {
		frame.particles.forEach((item) => {
			if (!item.isDeleted) drawBall(item.position.x, item.position.y, 3, 'red');
		});
	} else {
		frame.particles.forEach((item) => {
			if (!item.isDeleted) drawBall(item.position.x, item.position.y, 1*(hActualToPixel(item.radius) - hActualToPixel(0)), item.color);
		});
	}

	drawOrbit(engine.particles[0], engine.particles[1], "white");
	drawOrbit(engine.particles[0], engine.particles[2], "white");
	drawOrbit(engine.particles[0], engine.particles[4], "red");
	drawOrbit(engine.particles[0], engine.particles[5], "white");
	drawOrbit(engine.particles[0], engine.particles[6], "white");
	drawOrbit(engine.particles[0], engine.particles[7], "white");
	drawOrbit(engine.particles[3], engine.particles[4], "yellow");

	//drawOrbit(engine.particles[0], engine.particles[8], "white");
	//drawOrbit(engine.particles[0], engine.particles[9], "white");
	//drawOrbit(engine.particles[0], engine.particles[10], "white");
	//drawOrbit(engine.particles[3], engine.particles[4], "red");

	if (gridlinesOn) drawGridNumbers();

	let dx = 0;
	let dy = 0;
}

export { gridStep };
export { renderFrame };