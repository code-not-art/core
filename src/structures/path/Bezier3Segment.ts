import { Bezier } from 'bezier-js';
import Vec2 from '../../math/Vec2.js';
import { Segment, SegmentTypes } from './PathSegment.js';
import { Rectangle } from '../Rectangle.js';

export type Bezier3Segment = Segment<{
	type: typeof SegmentTypes.Bezier3;
	control1: Vec2;
	control2: Vec2;
}>;

/**
 * Creates an arc that goes from the start point, and rotates around the center point by the specified angle.
 * @param config angle in radians.
 * @returns
 */
export const Bezier3Segment = (config: { start: Vec2; control1: Vec2; control2: Vec2; end: Vec2 }): Bezier3Segment => {
	const { start, control1, control2, end } = config;
	const spline = new Bezier(start, control1, control2, end);

	// ##### Getters #####
	const getBounds: Bezier3Segment['get']['bounds'] = () => {
		const bounds = spline.bbox();

		const min = new Vec2(bounds.x.min, bounds.y.min);
		const max = new Vec2(bounds.x.max, bounds.y.max);
		return Rectangle({ min, max });
	};
	const getLength: Bezier3Segment['get']['length'] = () => {
		return spline.length();
	};
	const getNormal: Bezier3Segment['get']['normal'] = (position) => {
		const normal = spline.normal(position);
		return new Vec2(normal.x, normal.y);
	};
	const getPoint: Bezier3Segment['get']['point'] = (position) => {
		const point = spline.get(position);
		return new Vec2(point.x, point.y);
	};
	const getTangent: Bezier3Segment['get']['tangent'] = (position) => {
		const tangent = spline.derivative(position);
		return new Vec2(tangent.x, tangent.y).normalize();
	};

	// ##### Transform #####
	const translate: Bezier3Segment['transform']['translate'] = (translation) => {
		return Bezier3Segment({
			control1: control1.add(translation),
			control2: control2.add(translation),
			end: end.add(translation),
			start: start.add(translation),
		});
	};
	const rotate: Bezier3Segment['transform']['rotate'] = (angle, pivot) => {
		return Bezier3Segment({
			control1: control1.rotate(angle, pivot),
			control2: control2.rotate(angle, pivot),
			end: end.rotate(angle, pivot),
			start: start.rotate(angle, pivot),
		});
	};
	const scale: Bezier3Segment['transform']['scale'] = (factor, scaleCenter) => {
		return Bezier3Segment({
			control1: control1.scale(factor, scaleCenter),
			control2: control2.scale(factor, scaleCenter),
			end: end.scale(factor, scaleCenter),
			start: start.scale(factor, scaleCenter),
		});
	};

	return {
		type: SegmentTypes.Bezier3,
		start,
		end,
		control1,
		control2,
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
