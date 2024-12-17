import Vec2 from '../../math/Vec2.js';
import type { Values } from '../../types/common.js';
import { Rectangle } from '../Rectangle.js';
import type { ArcSegment } from './ArcSegment.js';
import type { Bezier2Segment } from './Bezier2Segment.js';
import type { Bezier3Segment } from './Bezier3Segment.js';
import type { LineSegment } from './LineSegment.js';

export const SegmentTypes = {
	/**
	 * Move the position with no line drawn
	 */
	Move: 'MOVE',
	Line: 'LINE',
	Arc: 'ARC',
	Bezier2: 'BEZIER2',
	Bezier3: 'BEZIER3',
} as const;
export type SegmentType = Values<typeof SegmentTypes>;

export type Segment<CustomSegment extends { type: SegmentType }> = CustomSegment & {
	start: Vec2;
	end: Vec2;
	get: {
		bounds: () => Rectangle;
		length: () => number;
		normal: (position: number) => Vec2;
		point: (position: number) => Vec2;
		tangent: (position: number) => Vec2;
	};
	transform: {
		translate: (translation: Vec2) => Segment<CustomSegment>;
		rotate: (angle: number, pivot: Vec2) => Segment<CustomSegment>;

		/**
		 * Scaling changes the size of the segment. Growing a shape is done from a central point,
		 * allowing it to remain centered somewhere other than the origin.
		 * @param factor
		 * @param center
		 * @returns
		 */
		scale: (factor: number | Vec2, center?: Vec2) => Segment<CustomSegment>;
	};
};

export type MoveSegment = Segment<{
	type: typeof SegmentTypes.Move;
}>;

export type PathSegment = MoveSegment | LineSegment | ArcSegment | Bezier2Segment | Bezier3Segment;
