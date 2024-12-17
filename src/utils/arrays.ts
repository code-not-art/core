export function array(length: number) {
	return Array.from({ length: length }, (_v, k) => k);
}
/**
 * Return an array of numbers from 0 to 1, with a number of evenly spaced steps.
 * The array length will be the number of steps plus 1, since this range is from 0 to 1 inclusive.
 *
 * @example
 * const quarters = ratioArray(4);
 * // [0, 0.25, 0.5, 0.75, 1]
 *
 * @param steps if less than 2 then this will return an array of `[0, 1]`
 * @returns
 */
export function ratioArray(steps: number) {
	if (steps < 2) {
		return range(0, 1, 1);
	}
	return range(0, 1, 1 / steps);
}
/**
 * Create an array, inclusive of the endpoints specified, with every value from the start to the end.
 * You can change the step size between values, by default it is 1.
 *
 * @example
 * const firstFive = range(1, 5); // [1, 2, 3, 4, 5]
 * const nearZero = range(-1, 1); // [-1, 0, 1]
 * const countdown = range(3, 0, -1) // [3, 2, 1, 0]
 * const quintiles = range(0, 0.8, 0.2) // [0, 0.2, 0.4, 0.6, 0.8]
 *
 * @param start
 * @param end
 * @param step
 * @returns
 */
export function range(start: number, end: number, step = 1) {
	return array(Math.floor((end - start) / step) + 1).map((i) => i * step + start);
}
export function sequence<T>(count: number, method: (i: number) => T): T[] {
	return array(count).map((i) => method(i));
}
export function repeat(count: number, action: (index: number, stopLoop: () => void) => void): void {
	for (let i = 0; i < count; i++) {
		let stopRequested = false;
		const stopLoop = () => (stopRequested = true);
		action(i, stopLoop);
		if (stopRequested) {
			break;
		}
	}
}
