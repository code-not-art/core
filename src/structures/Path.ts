import { Bezier2, Bezier3, Circle, Line, Rect } from '../canvas';
import { TAU } from '../constants';
import Vec2 from '../math/Vec2';

export enum SegmentType {
  Move = 'MOVE', // Jumps the position, no line drawn
  Line = 'LINE',
  Arc = 'ARC',
  Bezier2 = 'BEZIER2',
  Bezier3 = 'BEZIER3',
}

export type MoveSegment = {
  type: SegmentType.Move;
  point: Vec2;
};

export type LineSegment = {
  type: SegmentType.Line;
  point: Vec2;
};

export type ArcSegment = {
  type: SegmentType.Arc;
  angle: number;
  radius: number;
  center: Vec2;
};

export type Bezier2Segment = {
  type: SegmentType.Bezier2;
  point: Vec2;
  control: Vec2;
};

export type Bezier3Segment = {
  type: SegmentType.Bezier3;
  point: Vec2;
  control1: Vec2;
  control2: Vec2;
};

export type Segment = (
  | MoveSegment
  | LineSegment
  | ArcSegment
  | Bezier2Segment
  | Bezier3Segment
) & {
  start: Vec2;
  end: Vec2;
};

export default class Path {
  start: Vec2;
  segments: Segment[];
  constructor(start: Vec2) {
    this.start = start;
    this.segments = [];
  }

  getEnd(): Vec2 {
    return this.segments.length
      ? this.segments[this.segments.length - 1].end
      : this.start;
  }

  arc(angle: number, center: Vec2): Path {
    const start = this.getEnd();
    const radius = start.distance(center);
    const end = center.diff(start).rotate(angle);

    const segment: ArcSegment = {
      type: SegmentType.Arc,
      angle,
      radius,
      center,
    };

    this.segments.push({ ...segment, start, end });
    return this;
  }

  move(destination: Vec2): Path {
    const segment: MoveSegment = {
      type: SegmentType.Move,
      point: destination,
    };

    this.segments.push({ ...segment, start: this.getEnd(), end: destination });
    return this;
  }

  line(destination: Vec2): Path {
    const segment: LineSegment = {
      type: SegmentType.Line,
      point: destination,
    };

    this.segments.push({ ...segment, start: this.getEnd(), end: destination });
    return this;
  }

  bez2(destination: Vec2, control: Vec2): Path {
    const segment: Bezier2Segment = {
      type: SegmentType.Bezier2,
      point: destination,
      control,
    };

    this.segments.push({ ...segment, start: this.getEnd(), end: destination });
    return this;
  }

  bez3(destination: Vec2, control1: Vec2, control2: Vec2): Path {
    const segment: Bezier3Segment = {
      type: SegmentType.Bezier3,
      point: destination,
      control1,
      control2,
    };

    this.segments.push({ ...segment, start: this.getEnd(), end: destination });
    return this;
  }

  static fromCircle(circle: Circle): Path {
    const startPos = circle.center.add(Vec2.unit().scale(circle.radius));
    return new Path(startPos).arc(TAU, circle.center);
  }

  static fromLine(line: Line): Path {
    return new Path(line.start).line(line.end);
  }

  static fromRect(rect: Rect): Path {
    const corners = [
      rect.point.add(new Vec2(rect.width, 0)),
      rect.point.add(new Vec2(rect.width, rect.height)),
      rect.point.add(new Vec2(0, rect.height)),
    ];
    return new Path(rect.point)
      .line(corners[0])
      .line(corners[1])
      .line(corners[2])
      .line(rect.point);
  }

  static fromBez2(bez2: Bezier2): Path {
    return new Path(bez2.start).bez2(bez2.end, bez2.control);
  }

  static fromBez3(bez3: Bezier3): Path {
    return new Path(bez3.start).bez3(bez3.end, bez3.control1, bez3.control2);
  }
}
