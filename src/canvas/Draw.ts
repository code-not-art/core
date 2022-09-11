import Vec2 from '../math/Vec2';
import Color from '../color';
import Path, { SegmentType } from '../structures/Path';
import tinycolor from 'tinycolor2';

export type ColorSelection = Color | string | tinycolor.Instance;

function resolveColorSelection(selection: ColorSelection) {
  if (selection instanceof Color) {
    return selection;
  } else if (typeof selection === 'string') {
    return new Color(selection);
  } else {
    return new Color(selection.toRgbString());
  }
}

export type Stroke = {
  color: ColorSelection;
  width: number;
  cap?: 'round' | 'butt' | 'square';
};

export default class Draw {
  context: CanvasRenderingContext2D;
  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  /* *****
   * Every draw method sets up the geometry that will be drawn on the canvas context and then executes the stroke and fill on that geometry
   * Since this behaviour is repeated we'll capture it in these two private methods
   * Then we'll introduce draw(stroke, fill) which can be used to execute both methods
   * Note that fill is executed before stroke so that any outlines will appear on top on the canvas.
   */
  private draw(stroke?: Stroke, fill?: ColorSelection) {
    this.fill(fill);
    this.stroke(stroke);
  }
  private fill(fill?: ColorSelection) {
    if (fill) {
      const color = resolveColorSelection(fill);
      this.context.fillStyle = color.rgb();
      this.context.fill();
    }
  }
  private stroke(stroke?: Stroke) {
    if (stroke) {
      const color = resolveColorSelection(stroke.color);
      this.context.lineWidth = stroke.width;
      this.context.strokeStyle = color.rgb();
      if (stroke.cap) {
        this.context.lineCap = stroke.cap;
      }
      this.context.stroke();
    }
  }

  // -- Different geometries below
  circle(inputs: {
    center: Vec2;
    radius: number;
    fill?: ColorSelection;
    stroke?: Stroke;
  }) {
    this.context.beginPath();
    this.context.arc(
      inputs.center.x,
      inputs.center.y,
      inputs.radius,
      0,
      Math.PI * 2,
    );
    this.context.closePath();
    this.draw(inputs.stroke, inputs.fill);
  }

  // TODO: Expand rect to also handle rounded corners. Probably want to take advantage of Path API once written.
  rect(inputs: {
    point: Vec2;
    height: number;
    width: number;
    stroke?: Stroke;
    fill?: ColorSelection;
  }) {
    // Map all corners except the start
    const corners = [
      inputs.point.add(new Vec2(inputs.width, 0)),
      inputs.point.add(new Vec2(inputs.width, inputs.height)),
      inputs.point.add(new Vec2(0, inputs.height)),
    ];

    this.context.beginPath();
    this.context.moveTo(inputs.point.x, inputs.point.y);
    corners.forEach((corner) => {
      // Move to each corner
      this.context.lineTo(corner.x, corner.y);
    });
    this.context.closePath();
    this.draw(inputs.stroke, inputs.fill);
  }

  line(inputs: {
    start: Vec2;
    end: Vec2;
    stroke?: Stroke;
    fill?: ColorSelection;
  }) {
    this.context.beginPath();
    this.context.lineTo(inputs.start.x, inputs.start.y);
    this.context.closePath();
    this.draw(inputs.stroke, inputs.fill);
  }

  bezier2(inputs: {
    start: Vec2;
    control: Vec2;
    end: Vec2;
    stroke?: Stroke;
    fill?: ColorSelection;
  }) {
    const { start, control, end, stroke, fill } = inputs;
    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.quadraticCurveTo(control.x, control.y, end.x, end.y);
    this.context.closePath();
    this.draw(stroke, fill);
  }

  bezier3(inputs: {
    start: Vec2;
    control1: Vec2;
    control2: Vec2;
    end: Vec2;
    stroke?: Stroke;
    fill?: ColorSelection;
  }) {
    const { start, control1, control2, end, stroke, fill } = inputs;
    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.bezierCurveTo(
      control1.x,
      control1.y,
      control2.x,
      control2.y,
      end.x,
      end.y,
    );
    this.context.closePath();
    this.draw(stroke, fill);
  }

  path(inputs: {
    path: Path;
    fill?: ColorSelection;
    stroke?: Stroke;
    close?: boolean;
  }) {
    const { path, fill, stroke, close = false } = inputs;
    this.context.beginPath();
    this.context.moveTo(path.start.x, path.start.y);
    path.segments.forEach((segment) => {
      switch (segment.type) {
        case SegmentType.Move:
          this.context.moveTo(segment.point.x, segment.point.y);
          break;
        case SegmentType.Line:
          this.context.lineTo(segment.point.x, segment.point.y);
          break;
        case SegmentType.Bezier2:
          this.context.quadraticCurveTo(
            segment.control.x,
            segment.control.y,
            segment.point.x,
            segment.point.y,
          );
          break;
        case SegmentType.Bezier3:
          this.context.bezierCurveTo(
            segment.control1.x,
            segment.control1.y,
            segment.control2.x,
            segment.control2.y,
            segment.point.x,
            segment.point.y,
          );
          break;
      }
    });
    if (close) {
      this.context.closePath();
    }
    this.draw(stroke, fill);
  }
}
