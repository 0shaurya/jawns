import { Vector } from './Vector.js';

export class GravField {
	constructor(step, lowerBoundX, lowerBoundY, upperBoundX, upperBoundY) {
		this.step = step;
		this.lowerBoundX = lowerBoundY;
		this.upperBoundX = upperBoundX;
		this.lowerBoundY = lowerBoundY;
		this.upperBoundY = upperBoundY
	}

}