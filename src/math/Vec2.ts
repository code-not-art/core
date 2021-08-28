class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /* ===== Base Maths ===== */
  add(vector: Vec2) {
    return new Vec2(this.x + vector.x, this.y + vector.y);
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
    const radius = Math.sqrt(this.x * this.x + this.y * this.y);
    const theta = Math.atan2(this.y, this.x);
    return new Vec2(radius, theta);
  }

  /**
   * Converts a polar vector (radius, theta) to cartesian (x, y)
   */
  toCoords() {
    return new Vec2(Math.cos(this.y) * this.x, Math.sin(this.y) * this.x);
  }
}
