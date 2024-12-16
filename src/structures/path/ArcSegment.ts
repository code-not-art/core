import { TAU } from '../../constants.js';
import Vec2 from '../../math/Vec2.js';
import { clamp } from '../../utils/numeric.js';
import { Rectangle } from '../Rectangle.js';
import { Segment, SegmentTypes } from './PathSegment.js';

export type ArcSegment = Segment<{
  type: typeof SegmentTypes.Arc;
  angle: number;
  radius: number;
  center: Vec2;
}>;

/**
 * Creates an arc that goes from the start point, and rotates around the center point by the specified angle.
 * @param config angle in radians.
 * @returns
 */
export const ArcSegment = (config: {
  start: Vec2;
  center: Vec2;
  angle: number;
}): ArcSegment => {
  const { start, center, angle } = config;
  const initialVector = start.diff(center);
  const endVector = initialVector.rotate(angle);
  const end = center.add(initialVector.rotate(angle));
  const radius = start.distance(center);

  // Getters
  const getBounds: ArcSegment['get']['bounds'] = () => {
    const startAngle = initialVector.angle();
    const endAngle = endVector.angle();
    const isClockwise = angle > 0;

    const arcContains = (value: number): boolean => {
      const startAngleShifted = startAngle - value;
      const endAngleShifted = endAngle - value;

      return (
        Math.abs(angle) >= TAU ||
        (isClockwise
          ? (startAngleShifted <= 0 && endAngleShifted >= 0) ||
            (startAngleShifted > 0 &&
              endAngleShifted > 0 &&
              startAngleShifted > endAngleShifted) ||
            (startAngleShifted <= 0 &&
              endAngleShifted <= 0 &&
              startAngleShifted > endAngleShifted)
          : (startAngleShifted >= 0 && endAngleShifted <= 0) ||
            (startAngleShifted >= 0 &&
              endAngleShifted >= 0 &&
              startAngleShifted < endAngleShifted) ||
            (startAngleShifted <= 0 &&
              endAngleShifted <= 0 &&
              startAngleShifted < endAngleShifted))
      );
    };

    const maxRight = center.x + radius;
    const useMaxRight = arcContains(0);

    const maxBottom = center.y + radius;
    const useMaxBottom = arcContains(TAU / 4);

    const maxTop = center.y - radius;
    const useMaxTop = arcContains(-TAU / 4);

    const maxLeft = center.x - radius;
    const useMaxLeft = arcContains(-TAU / 2);

    const min = new Vec2(
      useMaxLeft ? maxLeft : Math.min(start.x, end.x),
      useMaxTop ? maxTop : Math.min(start.y, end.y),
    );
    const max = new Vec2(
      useMaxRight ? maxRight : Math.max(start.x, end.x),
      useMaxBottom ? maxBottom : Math.max(start.y, end.y),
    );

    return Rectangle({ min, max });
  };
  const getLength: ArcSegment['get']['length'] = () => {
    return Math.abs(radius * angle);
  };
  const getNormal: ArcSegment['get']['normal'] = (position) => {
    const positionAngle = angle * position;
    return initialVector
      .rotate(positionAngle)
      .scale(angle < 0 ? 1 : -1)
      .normalize();
  };
  const getPoint: ArcSegment['get']['point'] = (position) => {
    const clampedRatio = clamp(position, { max: 1, min: 0 });
    if (clampedRatio === 0) {
      return start;
    }
    if (clampedRatio === 1) {
      return end;
    }
    return initialVector.rotate(clampedRatio * angle).add(center);
  };
  const getTangent: ArcSegment['get']['tangent'] = (position) => {
    return getNormal(position).get.normal().invert().normalize();
  };

  // Transform
  const translate: ArcSegment['transform']['translate'] = (translation) => {
    return ArcSegment({
      angle: angle,
      center: center.add(translation),
      start: start.add(translation),
    });
  };
  const rotate: ArcSegment['transform']['rotate'] = (angle, pivot) => {
    return ArcSegment({
      angle: angle,
      center: center.rotate(angle, pivot),
      start: start.rotate(angle, pivot),
    });
  };
  const scale: ArcSegment['transform']['scale'] = (factor, scaleCenter) => {
    return ArcSegment({
      angle: angle,
      center: center.scale(factor, scaleCenter),
      start: start.scale(factor, scaleCenter),
    });
  };

  return {
    type: SegmentTypes.Arc,
    start,
    end,
    angle,
    center,
    radius,
    get: {
      bounds: getBounds,
      length: getLength,
      normal: getNormal,
      point: getPoint,
      tangent: getTangent,
    },
    transform: {
      rotate,
      scale,
      translate,
    },
  };
};
