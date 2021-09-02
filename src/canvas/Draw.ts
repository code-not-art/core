import Vec2 from '../math/Vec2';
import Color from '../color';
import Path, { Bezier2Segment, Bezier3Segment } from './Path';

export type Stroke = {
  color: Color;
  width: number;
};

export default class Draw {
  context: CanvasRenderingContext2D;
  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  /* *****
   * Stroke and Fill are the outputs of all of the draw methods
   * Since this behaviour is repeated we'll capture it in these two private methods
   * Then we'll introduce draw(stroke, fill) which can be used to execute both methods
   * Note that fill is executed before stroke so that any outlines will appear on top on the canvas.
   */
  private fill(fill?: Color) {
    if (fill) {
      this.context.fillStyle = fill.rgb();
      this.context.fill();
    }
  }
  private stroke(stroke?: Stroke) {
    if (stroke) {
      this.context.lineWidth = stroke.width;
      this.context.strokeStyle = stroke.color.rgb();
      this.context.stroke();
    }
  }
  private draw(stroke?: Stroke, fill?: Color) {
    this.fill(fill);
    this.stroke(stroke);
  }

  circle({
    origin,
    radius,
    fill,
    stroke,
  }: {
    origin: Vec2;
    radius: number;
    fill?: Color;
    stroke?: Stroke;
  }) {
    console.log(origin);
    this.context.beginPath();
    this.context.arc(origin.x, origin.y, radius, 0, Math.PI * 2);
    this.context.closePath();
    this.draw(stroke, fill);
  }

  // TODO: Expand Rect to also handle rounded corners. Probably want to take advantage of Path API once written.
  rect({
    point,
    height,
    width,
    stroke,
    fill,
  }: {
    point: Vec2;
    height: number;
    width: number;
    stroke: Stroke;
    fill: Color;
  }) {
    // Map all corners except the start
    const corners = [
      point.add(new Vec2(width, 0)),
      point.add(new Vec2(width, height)),
      point.add(new Vec2(0, height)),
    ];

    this.context.beginPath();
    this.context.moveTo(point.x, point.y);
    corners.forEach((corner) => {
      // Move to each corner
      this.context.lineTo(corner.x, corner.y);
    });
    this.context.closePath();
    this.draw(stroke, fill);
  }

  path({ path, fill, stroke }: { path: Path; fill?: Color; stroke?: Stroke }) {
    this.context.beginPath();
    this.context.moveTo(path.start.x, path.start.y);
    path.segments.forEach((segment) => {
      switch (segment.type) {
        case 'MOVE':
          this.context.moveTo(segment.point.x, segment.point.y);
          break;
        case 'LINE':
          this.context.lineTo(segment.point.x, segment.point.y);
          break;
        case 'BEZIER2':
          const bez2 = segment as Bezier2Segment;
          this.context.quadraticCurveTo(
            bez2.control.x,
            bez2.control.y,
            bez2.point.x,
            bez2.point.y,
          );
          break;
        case 'BEZIER3':
          const bez3 = segment as Bezier3Segment;
          this.context.bezierCurveTo(
            bez3.control1.x,
            bez3.control1.y,
            bez3.control2.x,
            bez3.control2.y,
            bez3.point.x,
            bez3.point.y,
          );
          break;
      }
    });
    this.context.closePath();
    this.draw(stroke, fill);
  }
}
