import Vec2 from '../../math/Vec2.js';
import { Rectangle } from '../Rectangle.js';
import { Segment, SegmentTypes } from './PathSegment.js';

export type MoveSegment = Segment<{
	type: typeof SegmentTypes.Move;
}>;

export const MoveSegment = (config: { start: Vec2; end: Vec2 }): MoveSegment => {
	const { start, end } = config;

	// Getters
	const getBounds: MoveSegment['get']['bounds'] = () => {
		return Rectangle.bounding(start, end);
	};
	const getLength: MoveSegment['get']['length'] = () => {
		return 0;
	};
	const getNormal: MoveSegment['get']['normal'] = (_position) => {
		return end.diff(start).get.normal();
	};
	const getPoint: MoveSegment['get']['point'] = (position) => {
		if (position < 0.5) {
			return start;
		}
		return end;
	};
	const getTangent: MoveSegment['get']['tangent'] = (_position) => {
		return end.diff(start).normalize();
	};

	// Transform
	const translate: MoveSegment['transform']['translate'] = (translation) => {
		return MoveSegment({
			start: start.add(translation),
			end: end.add(translation),
		});
	};
	const rotate: MoveSegment['transform']['rotate'] = (angle, pivot) => {
		return MoveSegment({
			start: start.rotate(angle, pivot),
			end: end.rotate(angle, pivot),
		});
	};
	const scale: MoveSegment['transform']['scale'] = (factor, center) => {
		return MoveSegment({
			start: start.scale(factor, center),
			end: end.scale(factor, center),
		});
	};

	return {
		type: SegmentTypes.Move,
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
