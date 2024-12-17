import Distribution from '../Distribution.js';

/**
 * Generator for a Sinusoidal distribution with values centered on 0.5 and ranging from 0 to 1 (instead of from -1 to 1).
 * The generated value will be expanded to a value from 0 to TAU (2PI) and then
 * the sin value of that input will be returned and shifted to the 0-1 range.
 * @param phase input offset from 0. Use PI/2 to represent a Cos distribution.
 * @param period input multiplier, changes the number of effective periods for the input.
 * @example
 * // Basic Sinusoidal distribution applied to Random.next()
 * rng.next( Sin(0, 1) );
 * @returns {Distribution}
 */
const Sin: (phase: number, period: number) => Distribution = (phase: number, period: number) => (x: number) =>
	(Math.sin(x * Math.PI * 2 * period + phase) + 1) / 2;

export default Sin;
