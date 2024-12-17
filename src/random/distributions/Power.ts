import Distribution from '../Distribution.js';

/**
 * Generator for a Power distribution
 * @param power the exponent to apply to the original generated value. Positive exponents will concentrate the generated value towards 0. Powers between 0 and 1 will concentrate the value towards 1. Negative exponents are not allowed and will be replaced with 1
 * @example
 * // Random value from the square Power distribution (x^2)
 * rng.next( Power(2) );
 * @returns {Distribution}
 */
const Power: (phase: number) => Distribution = (power: number) => (x: number) => Math.pow(x, power <= 0 ? 1 : power);

export default Power;
