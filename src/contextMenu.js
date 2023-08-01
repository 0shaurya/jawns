import { engine } from './engine.js';
import { mousePosition } from './zoomingpanning.js';

import { hActualToPixel, hPixelToActual, vActualToPixel, vPixelToActual } from './pixelActualConversions.js';

const canvas = document.getElementById('canv');
let contextMenu = document.getElementById("contextMenu");
let entityContextMenu = document.getElementById("entityContextMenu")
let entityInfo = document.getElementById('entityInfo');
let entityMass = document.getElementById('entityMass');
let entityType = document.getElementById('entityType');
let entityPosition = document.getElementById('entityPosition');
let entityVelocity = document.getElementById('entityVelocity');
let entityAcceleration = document.getElementById('entityAcceleration');

let deleteParticleRightClickButton = document.getElementById('deleteParticleRightClickButton');
let boltParticleRightClickButton = document.getElementById('boltParticleRightClickButton');
let trackParticleRightClickButton = document.getElementById('trackParticleRightClickButton');
let traceParticleRightClickButton = document.getElementById('traceParticleRightClickButton');
let followParticleRightClickButton = document.getElementById('followParticleRightClickButton');

let currentContextMenuItem;

let contextMenuCoords = {};

function inRange(x, y, diff) {
	return (Math.abs(x-y) <= diff);
}

function showMenu(x, y, menu) {
	document.getElementById(menu).style.top = y + "px";
	document.getElementById(menu).style.left = x + "px";
	document.getElementById(menu).style.visibility = "visible";
}

function hideAllMenus() {
	contextMenu.style.visibility = 'hidden';
	entityContextMenu.style.visibility = 'hidden';
	entityInfo.style.visibility = 'hidden';
	document.body.style.cursor = "default";
}

document.getElementById("canv").addEventListener('contextmenu', (e) => {
	engine.particles.forEach((item, index) => {
		if (inRange(hActualToPixel(mousePosition.x), hActualToPixel(item.position.x), 5) && inRange(vActualToPixel(mousePosition.y), vActualToPixel(item.position.y), 5)) {
			hideAllMenus();
			entityContextMenu.style.top = vActualToPixel(mousePosition.y) + canvas.getBoundingClientRect().top + "px";
			entityContextMenu.style.left = hActualToPixel(mousePosition.x) + canvas.getBoundingClientRect().left + "px";
			entityContextMenu.style.visibility = "visible";

			currentContextMenuItem = item;
		}
	})
	if (entityContextMenu.style.visibility === "hidden") {
			hideAllMenus();
			showMenu(e.clientX, e.clientY, "contextMenu");
	}
	contextMenuCoords.x = e.clientX - document.getElementById("canv").getBoundingClientRect().left;
	contextMenuCoords.y = e.clientY - document.getElementById("canv").getBoundingClientRect().top;
	
	e.preventDefault();
})

deleteParticleRightClickButton.addEventListener("click", (e) => {
	if (entityContextMenu.style.visibility === "visible") {
		hideAllMenus();
		currentContextMenuItem.delete();
	}
})
boltParticleRightClickButton.addEventListener("click", (e) => {
	if (entityContextMenu.style.visibility === "visible") {
		hideAllMenus();
		currentContextMenuItem.toggleBolted();
	}
})
trackParticleRightClickButton.addEventListener("click", (e) => {
	if (entityContextMenu.style.visibility === "visible") {
		hideAllMenus();
	}
})
traceParticleRightClickButton.addEventListener("click", (e) => {
	if (entityContextMenu.style.visibility === "visible") {
		hideAllMenus();
	}
})
followParticleRightClickButton.addEventListener("click", (e) => {
	if (entityContextMenu.style.visibility === "visible") {
		hideAllMenus();
		currentContextMenuItem.isFollowing = true;
	}
})

document.getElementById("canv").addEventListener('mousedown', function (e) {
	hideAllMenus();
	e.preventDefault();
})

document.getElementById("contextMenu").addEventListener('click', function (e) {
	hideAllMenus();
	e.preventDefault();
})

document.body.addEventListener('keydown', (e) => {
	if (e.shiftKey) {
		engine.particles.forEach((item, index) => {
			if (inRange(hActualToPixel(mousePosition.x), hActualToPixel(item.position.x), 5) && inRange(vActualToPixel(mousePosition.y), vActualToPixel(item.position.y), 5)) {
				entityInfo.style.left = hActualToPixel(item.position.x) + canvas.getBoundingClientRect().left + "px";
				entityInfo.style.top = vActualToPixel(item.position.y) + canvas.getBoundingClientRect().top + "px";
				entityInfo.style.visibility = 'visible';
				document.body.style.cursor = "default";

				entityType.textContent = item.isBolted ? "Particle (" + item.id + ")" + " (Bolted)" : "Particle (" + item.id + ")";
				entityMass.textContent = "mass: " + item.mass;
				entityPosition.textContent     = "p: " + getPosition(item);
				entityVelocity.textContent     = "v: " + getVelocity(item);
				entityAcceleration.textContent = "a: " + getAcceleration(item);
			}
		});
	}
});

document.body.addEventListener('keyup', (e) => {
	if (e.keyCode === 16) {
		hideAllMenus();
	}
});

function getPosition(particle) {
	return `(${Math.round(particle.position.x*1000)/1000}, ${Math.round(particle.position.y*1000)/1000})`;
}

function getVelocity(particle) {
	return `(${Math.round(particle.velocity.x*1000)/1000}, ${Math.round(particle.velocity.y*1000)/1000})`;
}

function getAcceleration(particle) {
	return `(${Math.round(particle.acceleration.x*1000)/1000}, ${Math.round(particle.acceleration.y*1000)/1000})`;
}

export { contextMenuCoords };