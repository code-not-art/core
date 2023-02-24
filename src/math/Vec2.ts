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

  scale(value: number | Vec2): Vec2 {
    if (typeof value === 'object') {
      return new Vec2(this.x * value.x, this.y * value.y);
    } else {
      return new Vec2(this.x * value, this.y * value);
    }
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

  within(max: Vec2, min?: Vec2): boolean {
    const _min = min || Vec2.origin();
    return (
      this.x < max.x && this.y < max.y && this.x > _min.x && this.y > _min.y
    );
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
   *
   * @param angle in radians
   * @returns
   */
  rotate(angle: number): Vec2 {
    return this.toPolar().add(new Vec2(0, angle)).toCoords();
  }
  withMagnitude = (magnitude: number) => {
    return this.normalize().scale(magnitude);
  };
  withAngle = (angle: number) => {
    return Vec2.unit().rotate(angle).scale(this.magnitude());
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
}
export default Vec2;
