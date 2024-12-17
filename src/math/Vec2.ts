import { Constants } from '../index.js';

/**
 * Two dimensional vector.
 * Most methods treat the vector as though it is in cartesian space, with coordinates (x, y). The two conversion methods change (x, y) coordinates to (radius, angle) where the angle, in radians, is from the x-axis to the vector.
 */
class Vec2 {
	x: number;
	y: number;

	/**
	 * Vec2 constructor. If only one number is passed in, the class property y will be set to the same value as x.
	 * @example specify single parameter
	 * new Vec2(10)
	 * // same as Vec2(10,10)
	 * @param x
	 * @param y Optional, if ommitted, use same x value for both x and y
	 */
	constructor(x: number, y?: number) {
		this.x = x;
		this.y = y === undefined ? x : y;
	}

	/* ===== Properties ===== */
	magnitude(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	/**
	 *
	 * @returns Angle in radians of the vector's rotation from 0. Assumes vector is cartesian coordinates.
	 */
	angle(): number {
		return Math.atan2(this.y, this.x);
	}

	/* ===== Base Maths ===== */
	add(value: Vec2 | number): Vec2 {
		if (value instanceof Vec2) {
			return new Vec2(this.x + value.x, this.y + value.y);
		} else {
			return new Vec2(this.x + value, this.y + value);
		}
	}

	diff(value: Vec2 | number): Vec2 {
		if (value instanceof Vec2) {
			return new Vec2(this.x - value.x, this.y - value.y);
		} else {
			return new Vec2(this.x - value, this.y - value);
		}
	}
	invert(): Vec2 {
		return this.scale(-1);
	}

	/**
	 * Multiply the x and y values of the Vec2. If the factor is a number, then x and y are scaled by the same
	 * amount. If a Vec2 is provided then the x and y will be scaled based on the x and y values of the factor.
	 *
	 * Scaling is done from the origin by default, but if another center is provided than the distance from the
	 * given center is scaled instead, allowing a vector to be expanded from a point.
	 */
	scale(factor: number | Vec2, center = Vec2.zero()): Vec2 {
		const vectorFactor = typeof factor === 'number' ? new Vec2(factor, factor) : factor;
		const diff = this.diff(center);
		return new Vec2(diff.x * vectorFactor.x, diff.y * vectorFactor.y).add(center);
	}

	dot(vector: Vec2): number {
		return this.x * vector.x + this.y * vector.y;
	}

	/**
	 * Equivalent to the determinant between two Vec2's, not exactly the 3D vector cross product.
	 * @param vector
	 * @returns
	 */
	cross(vector: Vec2): number {
		return this.x * vector.y - this.y * vector.x;
	}

	/**
	 * Checks if this vector fits within a given range.
	 * @param max
	 * @param min Defaults to the origin (0,0)
	 * @returns
	 */
	within(max: Vec2, min?: Vec2): boolean {
		const _min = min || Vec2.origin();
		return this.x < max.x && this.y < max.y && this.x > _min.x && this.y > _min.y;
	}

	distance(value: Vec2 | number): number {
		return this.diff(value).magnitude();
	}

	/* ===== Modify ===== */
	normalize(): Vec2 {
		const M = this.magnitude();
		return new Vec2(this.x / M, this.y / M);
	}
	/**
	 * Rotates a Vec2, assumed to be in cartesian coordinates, around a pivot point.
	 * If no pivot point is provided, this rotates around the origin `(0, 0)`
	 * @param angle in radians
	 * @returns
	 */
	rotate(angle: number, pivot = Vec2.zero()): Vec2 {
		return this.diff(pivot).toPolar().add(new Vec2(0, angle)).toCoords().add(pivot);
	}
	withMagnitude = (magnitude: number) => {
		return this.normalize().scale(magnitude);
	};
	withAngle = (angle: number) => {
		return Vec2.unit().rotate(angle).scale(this.magnitude());
	};

	get = {
		/**
		 * Returns the unit vector normal to this vector.
		 * This is equivalent to a 90 degree rotation.
		 * @returns
		 */
		normal: (): Vec2 => this.rotate(Constants.TAU / 4).normalize(),
	};

	/* ===== Convert ===== */
	/**
	 * Converts a cartesian vector (x, y) to polar (radius, theta)
	 * Theta angle will be in radians
	 */
	toPolar(): Vec2 {
		return new Vec2(this.magnitude(), this.angle());
	}

	/**
	 * Converts a polar vector (radius, theta) to cartesian (x, y)
	 */
	toCoords(): Vec2 {
		return new Vec2(Math.cos(this.y) * this.x, Math.sin(this.y) * this.x);
	}

	// ===== Static generators for common simple vectors

	/**
	 * Vec2 for the origin of the plane. Shortcut for `new Vec2(0, 0)`
	 * @returns {Vec2} (0, 0)
	 */
	static origin(): Vec2 {
		return new Vec2(0, 0);
	}

	/**
	 * Alias for `Vec2.origin`. Shortcut for `new Vec2(0, 0)`
	 * @returns {Vec2} (0, 0)
	 */
	static zero(): Vec2 {
		return Vec2.origin();
	}

	/**
	 * Vec2 of size 1 along the first (x) axis. Shortcut for `new Vec2(1, 0)`.
	 * @returns {vec2} (1, 0)
	 */
	static unit(): Vec2 {
		return new Vec2(1, 0);
	}

	/**
	 * Vec2 of all 1's. Shortcut for `new Vec2(1, 1)`
	 * @returns {Vec2} (0, 0)
	 */
	static ones(): Vec2 {
		return new Vec2(1, 1);
	}

	/**
	 * Create a new Vec2 based on another Vec2 or a single number.
	 *
	 * For a Vec2 argument, this will return a new Vec2 with the same x and y values as the provided Vec2.
	 * For a number argument, this will return a new Vec2 with both x and y equal to the provided number.
	 */
	static from(prototype: Vec2 | number): Vec2 {
		if (prototype instanceof Vec2) {
			return new Vec2(prototype.x, prototype.y);
		} else {
			return new Vec2(prototype);
		}
	}

	/**
	 * Find the minimum vector defined by the bounding box of a list of Vec2.
	 * Returns a Vec2 with the minimum x and y of the provided input vectors.
	 * @param inputs
	 */
	static min(...inputs: Vec2[]): Vec2 {
		return new Vec2(Math.min(...inputs.map((v) => v.x)), Math.min(...inputs.map((v) => v.y)));
	}
	/**
	 * Find the maximum vector defined by the bounding box of a list of Vec2.
	 * Returns a Vec2 with the maximum x and y of the provided input vectors.
	 * @param inputs
	 */
	static max(...inputs: Vec2[]): Vec2 {
		return new Vec2(Math.max(...inputs.map((v) => v.x)), Math.max(...inputs.map((v) => v.y)));
	}
}
export default Vec2;
