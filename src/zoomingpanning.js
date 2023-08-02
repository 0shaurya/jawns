import { hPixelToActual, hActualToPixel, vPixelToActual, vActualToPixel } from './pixelActualConversions.js';
import { engine } from './engine.js';

//let scale = 1;
let scale = .000000000002;
let translateX = 0;
let translateY = 0;

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

let mousePosition = { x:0, y:0};

let rect = document.getElementById("canv").getBoundingClientRect();

document.getElementById("canv").addEventListener('mousedown', startDragging);
document.getElementById("canv").addEventListener('mousemove', dragCanvas);
document.getElementById("canv").addEventListener('mouseup', stopDragging);
document.getElementById("canv").addEventListener('mouseleave', stopDragging);

function startDragging(e) {
	isDragging = true;
	dragStartX = e.clientX;
	dragStartY = e.clientY;
}

function dragCanvas(e) {
	if (!isDragging) return;
	
	engine.particles.forEach((item, index) => {
		item.isFollowing = false;
	});

	translateX += (e.clientX - dragStartX);
	translateY += (e.clientY - dragStartY);
	
	dragStartX = e.clientX;
	dragStartY = e.clientY;
}

function stopDragging() {
	isDragging = false;
}

function updateFollowing() {
	engine.particles.forEach((item, index) => {
		if (item.isFollowing) {
			translateX = -hActualToPixel(item.position.x) + hActualToPixel(0);
			translateY = -vActualToPixel(item.position.y) + vActualToPixel(0);
		}
	})
}

export { translateX };
export { translateY };
export { mousePosition };
export { updateFollowing };

// 

document.getElementById("canv").addEventListener('wheel', zoom);

function zoom(e) {
	let actualNumberOfZoomedIn = {};
	actualNumberOfZoomedIn.x = hPixelToActual(e.clientX - rect.left);
	actualNumberOfZoomedIn.y = vPixelToActual(e.clientY - rect.top);

	let actualPixelOfZoomedIn = {};
	actualPixelOfZoomedIn.x = hActualToPixel(actualNumberOfZoomedIn.x);
	actualPixelOfZoomedIn.y = vActualToPixel(actualNumberOfZoomedIn.y);

	scale = 2**(Math.log(scale)/Math.log(2) + e.deltaY/(-1080));
	translateX += actualPixelOfZoomedIn.x - hActualToPixel(actualNumberOfZoomedIn.x);
	translateY += actualPixelOfZoomedIn.y - vActualToPixel(actualNumberOfZoomedIn.y)
}

export { scale };

//

document.getElementById("canv").addEventListener('mousemove', printMousePositionAndScale);
document.getElementById("canv").addEventListener('wheel', printMousePositionAndScale);

function printMousePositionAndScale(e) {
	mousePosition = {
		x: ((e.clientX - rect.left)-512 - translateX)/32 / scale,
    	y: (-(e.clientY - rect.top)+288 + translateY)/32 / scale
    };
    document.getElementById("mousePosition").textContent = `(${Math.round(mousePosition.x*1000)/1000}, ${Math.round(mousePosition.y*1000)/1000})`;
    document.getElementById("zoomFactor").textContent = `Zoom: ${Math.round(scale*100)/100}x`;
}