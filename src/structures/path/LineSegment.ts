import Vec2 from '../../math/Vec2.js';
import { clamp } from '../../utils/numeric.js';
import { Rectangle } from '../Rectangle.js';
import { Segment, SegmentTypes } from './PathSegment.js';

export type LineSegment = Segment<{
	type: typeof SegmentTypes.Line;
}>;

export const LineSegment = (config: { start: Vec2; end: Vec2 }): LineSegment => {
	const { start, end } = config;

	// Getters
	const getBounds: LineSegment['get']['bounds'] = () => {
		const min = new Vec2(Math.min(start.x, end.x), Math.min(start.y, end.y));
		const max = new Vec2(Math.max(start.x, end.x), Math.max(start.y, end.y));

		return Rectangle({ min, max });
	};
	const getLength: LineSegment['get']['length'] = () => {
		return end.diff(start).magnitude();
	};
	const getNormal: LineSegment['get']['normal'] = (_position) => {
		return end.diff(start).get.normal();
	};
	const getPoint: LineSegment['get']['point'] = (position) => {
		const clampedRatio = clamp(position, { max: 1, min: 0 });
		if (clampedRatio === 0) {
			return start;
		}
		if (clampedRatio === 1) {
			return end;
		}
		return start.add(end.diff(start).scale(clampedRatio));
	};
	const getTangent: LineSegment['get']['tangent'] = (_position) => {
		return end.diff(start).normalize();
	};

	// Transform
	const translate: LineSegment['transform']['translate'] = (translation) => {
		return LineSegment({
			start: start.add(translation),
			end: end.add(translation),
		});
	};
	const rotate: LineSegment['transform']['rotate'] = (angle, pivot) => {
		return LineSegment({
			start: start.rotate(angle, pivot),
			end: end.rotate(angle, pivot),
		});
	};
	const scale: LineSegment['transform']['scale'] = (factor, center) => {
		return LineSegment({
			start: start.scale(factor, center),
			end: end.scale(factor, center),
		});
	};

	return {
		type: SegmentTypes.Line,
		start,
		end,
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
