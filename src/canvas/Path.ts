import Vec2 from '../math/Vec2';

enum SegmentType {
  Move = 'MOVE', // Jumps the position, no line drawn
  Line = 'LINE',
  Bezier2 = 'BEZIER2',
  Bezier3 = 'BEZIER3',
}

export interface Segment {
  type: SegmentType;
  point: Vec2;
}

export interface MoveSegment extends Segment {
  type: SegmentType.Move;
}

export interface LineSegment extends Segment {
  type: SegmentType.Line;
}

export interface Bezier2Segment extends Segment {
  type: SegmentType.Bezier2;
  control: Vec2;
}

export interface Bezier3Segment extends Segment {
  type: SegmentType.Bezier3;
  control1: Vec2;
  control2: Vec2;
}

export default class Path {
  start: Vec2;
  segments: Segment[];
  constructor(start: Vec2) {
    this.start = start;
    this.segments = [];
  }

  move(destination: Vec2) {
    const segment: MoveSegment = {
      type: SegmentType.Move,
      point: destination,
    };

    this.segments.push(segment);
  }

  line(destination: Vec2) {
    const segment: LineSegment = {
      type: SegmentType.Line,
      point: destination,
    };

    this.segments.push(segment);
  }

  bez2(destination: Vec2, control: Vec2) {
    const segment: Bezier2Segment = {
      type: SegmentType.Bezier2,
      point: destination,
      control,
    };

    this.segments.push(segment);
  }

  bez3(destination: Vec2, control1: Vec2, control2: Vec2) {
    const segment: Bezier3Segment = {
      type: SegmentType.Bezier3,
      point: destination,
      control1,
      control2,
    };

    this.segments.push(segment);
  }
}
