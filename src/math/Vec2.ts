class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /* ===== Base Maths ===== */
  add(value: Vec2 | number) {
    if (value instanceof Vec2) {
      return new Vec2(this.x + value.x, this.y + value.y);
    } else {
      return new Vec2(this.x + value, this.y + value);
    }
  }

  diff(vector: Vec2) {
    return new Vec2(this.x - vector.x, this.y - vector.y);
  }

  scale(scalar: number) {
    return new Vec2(this.x * scalar, this.y * scalar);
  }

  dot(vector: Vec2) {
    return this.x * vector.x + this.y * vector.y;
  }

  cross(vector: Vec2) {
    return this.x * vector.y - this.y * vector.x;
  }

  /* ===== Properties ===== */
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  angle() {
    return Math.atan2(this.y, this.x);
  }

  /* ===== Modify ===== */
  normalize() {
    const M = this.magnitude();
    return new Vec2(this.x / M, this.y / M);
  }
  rotate(angle: number) {
    return this.toPolar().add(new Vec2(0, angle)).toCoords();
  }

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

  static origin() {
    return new Vec2(0, 0);
  }

  static unit() {
    return new Vec2(1, 0);
  }
}
export default Vec2;
