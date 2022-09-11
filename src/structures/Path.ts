import Vec2 from '../math/Vec2';

export enum SegmentType {
  Move = 'MOVE', // Jumps the position, no line drawn
  Line = 'LINE',
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

export type Segment =
  | MoveSegment
  | LineSegment
  | Bezier2Segment
  | Bezier3Segment;

export default class Path {
  start: Vec2;
  segments: Segment[];
  constructor(start: Vec2) {
    this.start = start;
    this.segments = [];
  }

  move(destination: Vec2): Path {
    const segment: MoveSegment = {
      type: SegmentType.Move,
      point: destination,
    };

    this.segments.push(segment);
    return this;
  }

  line(destination: Vec2): Path {
    const segment: LineSegment = {
      type: SegmentType.Line,
      point: destination,
    };

    this.segments.push(segment);
    return this;
  }

  bez2(destination: Vec2, control: Vec2): Path {
    const segment: Bezier2Segment = {
      type: SegmentType.Bezier2,
      point: destination,
      control,
    };

    this.segments.push(segment);
    return this;
  }

  bez3(destination: Vec2, control1: Vec2, control2: Vec2): Path {
    const segment: Bezier3Segment = {
      type: SegmentType.Bezier3,
      point: destination,
      control1,
      control2,
    };

    this.segments.push(segment);
    return this;
  }
}
