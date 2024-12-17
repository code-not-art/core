import { TAU } from '../constants.js';
// Degree and Radian conversion
export function toDegrees(rads: number): number {
	return (rads / TAU) * 360;
}

export function toRadians(degrees: number): number {
	return (degrees / 360) * TAU;
}
