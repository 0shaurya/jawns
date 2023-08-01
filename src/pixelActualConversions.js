import { translateX } from './zoomingpanning.js';
import { translateY } from './zoomingpanning.js';
import { scale } from './zoomingpanning.js';

let canvas = document.getElementById("canv");

function hPixelToActual(pixelX) {
	let returnValue;
	returnValue = pixelX-(canvas.width/2); 	// account for where canvas coordinates start
	returnValue = returnValue - translateX;	// account for panning
	returnValue = returnValue / scale;		// account for zooming
	returnValue = returnValue/32;			// account for horizontal stretch of canvas coordinates
	
	return returnValue;
}

function hActualToPixel(actualX) {
	return 32*scale*actualX + (canvas.width/2) + translateX;

}

function vPixelToActual(pixelY) {
	let returnValue;
	returnValue = pixelY-(canvas.height/2); // account for where canvas coordinates start
	returnValue = returnValue - translateY;	// account for panning
	returnValue = returnValue / scale;		// account for zooming
	returnValue = returnValue/32;			// account for horizontal stretch of canvas coordinates
	
	return returnValue*-1;
}

function vActualToPixel(actualY) {
	return (-1)*32*scale*actualY + (canvas.height/2) + translateY;
}

export { hPixelToActual };
export { vPixelToActual };
export { hActualToPixel };
export { vActualToPixel };