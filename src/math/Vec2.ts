/**
 * Two dimensional vector.
 * Most methods treat the vector as though it is in cartesian space, with coordinates (x, y). The two conversion methods change (x, y) coordinates to (radius, angle) where the angle, in radians, is from the x-axis to the vector.
 */
class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /* ===== Properties ===== */
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  angle() {
    return Math.atan2(this.y, this.x);
  }

  /* ===== Base Maths ===== */
  add(value: Vec2 | number) {
    if (value instanceof Vec2) {
      return new Vec2(this.x + value.x, this.y + value.y);
    } else {
      return new Vec2(this.x + value, this.y + value);
    }
  }

  diff(value: Vec2 | number) {
    if (value instanceof Vec2) {
      return new Vec2(this.x - value.x, this.y - value.y);
    } else {
      return new Vec2(this.x - value, this.y - value);
    }
  }

  scale(value: number | Vec2) {
    if (typeof value === 'object') {
      return new Vec2(this.x * value.x, this.y * value.y);
    } else {
      return new Vec2(this.x * value, this.y * value);
    }
  }

  dot(vector: Vec2) {
    return this.x * vector.x + this.y * vector.y;
  }

  /**
   * Equivalent to the determinant between two Vec2's, not exactly the 3D vector cross product.
   * @param vector
   * @returns
   */
  cross(vector: Vec2) {
    return this.x * vector.y - this.y * vector.x;
  }

  within(max: Vec2, min?: Vec2) {
    const _min = min || Vec2.origin();
    return (
      this.x < max.x && this.y < max.y && this.x > _min.x && this.y > _min.y
    );
  }

  /* ===== Modify ===== */
  normalize() {
    const M = this.magnitude();
    return new Vec2(this.x / M, this.y / M);
  }
  /**
   *
   * @param angle in radians
   * @returns
   */
  rotate(angle: number) {
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
  toPolar() {
    return new Vec2(this.magnitude(), this.angle());
  }

  /**
   * Converts a polar vector (radius, theta) to cartesian (x, y)
   */
  toCoords() {
    return new Vec2(Math.cos(this.y) * this.x, Math.sin(this.y) * this.x);
  }

  // ===== Some generators for common simple vectors

  /**
   * Vec2 for the origin of the plane. Shortcut for `new Vec2(0, 0)`
   * @returns {Vec2} (0, 0)
   */
  static origin() {
    return new Vec2(0, 0);
  }

  /**
   * Alias for `Vec2.origin`. Shortcut for `new Vec2(0, 0)`
   * @returns {Vec2} (0, 0)
   */
  static zero() {
    return Vec2.origin();
  }

  /**
   * Vec2 of size 1 along the first (x) axis. Shortcut for `new Vec2(1, 0)`.
   * @returns {vec2} (1, 0)
   */
  static unit() {
    return new Vec2(1, 0);
  }

  /**
   * Vec2 of all 1's. Shortcut for `new Vec2(1, 1)`
   * @returns {Vec2} (0, 0)
   */
  static ones() {
    return new Vec2(1, 1);
  }
}
export default Vec2;
