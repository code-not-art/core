import { Bezier } from 'bezier-js';
import Vec2 from '../../math/Vec2.js';
import { Segment, SegmentTypes } from './PathSegment.js';
import { Rectangle } from '../Rectangle.js';

export type Bezier2Segment = Segment<{
	type: typeof SegmentTypes.Bezier2;
	control: Vec2;
}>;

/**
 * Creates an arc that goes from the start point, and rotates around the center point by the specified angle.
 * @param config angle in radians.
 * @returns
 */
export const Bezier2Segment = (config: { start: Vec2; control: Vec2; end: Vec2 }): Bezier2Segment => {
	const { start, control, end } = config;
	const spline = new Bezier(start, control, end);

	// ##### Getters #####
	const getBounds: Bezier2Segment['get']['bounds'] = () => {
		const bounds = spline.bbox();

		const min = new Vec2(bounds.x.min, bounds.y.min);
		const max = new Vec2(bounds.x.max, bounds.y.max);
		return Rectangle({ min, max });
	};
	const getLength: Bezier2Segment['get']['length'] = () => {
		return spline.length();
	};
	const getNormal: Bezier2Segment['get']['normal'] = (position) => {
		const normal = spline.normal(position);
		return new Vec2(normal.x, normal.y);
	};
	const getPoint: Bezier2Segment['get']['point'] = (position) => {
		const point = spline.get(position);
		return new Vec2(point.x, point.y);
	};
	const getTangent: Bezier2Segment['get']['tangent'] = (position) => {
		const tangent = spline.derivative(position);
		return new Vec2(tangent.x, tangent.y).normalize();
	};

	// ##### Transform #####
	const translate: Bezier2Segment['transform']['translate'] = (translation) => {
		return Bezier2Segment({
			control: control.add(translation),
			end: end.add(translation),
			start: start.add(translation),
		});
	};
	const rotate: Bezier2Segment['transform']['rotate'] = (angle, pivot) => {
		return Bezier2Segment({
			control: control.rotate(angle, pivot),
			end: end.rotate(angle, pivot),
			start: start.rotate(angle, pivot),
		});
	};
	const scale: Bezier2Segment['transform']['scale'] = (factor, scaleCenter) => {
		return Bezier2Segment({
			control: control.scale(factor, scaleCenter),
			end: end.scale(factor, scaleCenter),
			start: start.scale(factor, scaleCenter),
		});
	};

	return {
		type: SegmentTypes.Bezier2,
		start,
		end,
		control,
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
