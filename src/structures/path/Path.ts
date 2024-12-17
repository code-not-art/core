import { Bezier2, Bezier3, Circle, Line } from '../../canvas/index.js';
import { TAU } from '../../constants.js';
import Vec2 from '../../math/Vec2.js';
import { ratioArray } from '../../utils/arrays.js';
import { clamp } from '../../utils/numeric.js';
import { Rectangle, type RectangleConfig } from '../Rectangle.js';
import { ArcSegment } from './ArcSegment.js';
import { Bezier2Segment } from './Bezier2Segment.js';
import { Bezier3Segment } from './Bezier3Segment.js';
import { LineSegment } from './LineSegment.js';
import { MoveSegment } from './MoveSegment.js';
import { type PathSegment } from './PathSegment.js';

export class Path {
	private start: Vec2;
	private end: Vec2;
	private segments: PathSegment[];
	constructor(start: Vec2) {
		this.start = start;
		this.end = start;
		this.segments = [];
	}

	get = {
		bounds: (): { min: Vec2; max: Vec2 } => {
			let min = Vec2.from(this.start);
			let max = Vec2.from(this.start);
			this.segments.forEach((segment) => {
				const bounds = segment.get.bounds();

				min.x = Math.min(min.x, bounds.min.x);
				min.y = Math.min(min.y, bounds.min.y);

				max.x = Math.max(max.x, bounds.max.x);
				max.y = Math.max(max.y, bounds.max.y);
			});
			return Rectangle({ min, max });
		},
		end: (): Vec2 => this.end,
		length: (): number =>
			this.segments.reduce((acc, segment) => {
				acc += segment.get.length();
				return acc;
			}, 0),
		normal: (position: number): Vec2 => {
			const clampedPosition = clamp(position, { max: 1, min: 0 });
			if (clampedPosition === 0) {
				return this.segments[0]?.get.normal(0);
			}
			if (clampedPosition === 1) {
				return this.segments[this.segments.length - 1]?.get.normal(1);
			}
			const pathLength = this.get.length();

			let traveledRatio = 0;
			for (const segment of this.segments) {
				const segmentLengthRatio = segment.get.length() / pathLength;

				if (traveledRatio + segmentLengthRatio >= clampedPosition) {
					const remainingRatio = clampedPosition - traveledRatio;
					const targetRatio = clamp(remainingRatio / segmentLengthRatio, {
						max: 1,
						min: 0,
					});
					return segment.get.normal(targetRatio);
				} else {
					traveledRatio += segmentLengthRatio;
				}
			}
			// Shouldn't reach here...
			console.warn(
				'Math failed and we were unable to get the correct point location along the path. Returning the end of the path!',
			);
			return this.segments[this.segments.length - 1]?.get.normal(1);
		},
		point: (position: number): Vec2 => {
			const clampedPosition = clamp(position, { max: 1, min: 0 });
			if (clampedPosition === 0) {
				return this.start;
			}
			if (clampedPosition === 1) {
				return this.get.end();
			}
			const pathLength = this.get.length();

			let traveledRatio = 0;
			for (const segment of this.segments) {
				const segmentLengthRatio = segment.get.length() / pathLength;

				if (traveledRatio + segmentLengthRatio >= clampedPosition) {
					const remainingRatio = clampedPosition - traveledRatio;
					const targetRatio = clamp(remainingRatio / segmentLengthRatio, {
						max: 1,
						min: 0,
					});
					return segment.get.point(targetRatio);
				} else {
					traveledRatio += segmentLengthRatio;
				}
			}
			// Shouldn't reach here...
			console.warn(
				'Math failed and we were unable to get the correct point location along the line. Returning the end of the line!',
			);
			return this.get.end();
		},
		segmentAt: (position: number): PathSegment => {
			const clampedPosition = clamp(position, { max: 1, min: 0 });
			if (clampedPosition === 0) {
				return this.segments[0];
			}
			if (clampedPosition === 1) {
				return this.segments[this.segments.length - 1];
			}
			const pathLength = this.get.length();

			let traveledRatio = 0;
			for (const segment of this.segments) {
				const segmentLengthRatio = segment.get.length() / pathLength;

				if (traveledRatio + segmentLengthRatio >= clampedPosition) {
					return segment;
				} else {
					traveledRatio += segmentLengthRatio;
				}
			}
			// Shouldn't reach here...
			console.warn(
				'Math failed and we were unable to get the correct point location along the path. Returning the end of the path!',
			);
			return this.segments[this.segments.length - 1];
		},
		segments: () => [...this.segments],
		start: (): Vec2 => Vec2.from(this.start),
		tangent: (position: number): Vec2 => {
			const clampedPosition = clamp(position, { max: 1, min: 0 });
			if (clampedPosition === 0) {
				return this.segments[0]?.get.tangent(0);
			}
			if (clampedPosition === 1) {
				return this.segments[this.segments.length - 1]?.get.tangent(1);
			}
			const pathLength = this.get.length();

			let traveledRatio = 0;
			for (const segment of this.segments) {
				const segmentLengthRatio = segment.get.length() / pathLength;

				if (traveledRatio + segmentLengthRatio >= clampedPosition) {
					const remainingRatio = clampedPosition - traveledRatio;
					const targetRatio = clamp(remainingRatio / segmentLengthRatio, {
						max: 1,
						min: 0,
					});
					return segment.get.tangent(targetRatio);
				} else {
					traveledRatio += segmentLengthRatio;
				}
			}
			// Shouldn't reach here...
			console.warn(
				'Math failed and we were unable to get the correct point location along the path. Returning the end of the path!',
			);
			return this.segments[0]?.get.tangent(0);
		},
	};

	transform = {
		scale: (factor: number | Vec2, center = Vec2.zero()): Path => {
			this.start = this.start.scale(factor, center);
			this.end = this.end.scale(factor, center);
			this.segments = this.segments.map((segment) => segment.transform.scale(factor, center));
			return this;
		},
		rotate: (angle: number, pivot = Vec2.zero()): Path => {
			this.start = this.start.rotate(angle, pivot);
			this.end = this.end.rotate(angle, pivot);
			this.segments = this.segments.map((segment) => segment.transform.rotate(angle, pivot));
			return this;
		},
		translate: (translation: Vec2): Path => {
			this.start = this.start.add(translation);
			this.end = this.end.add(translation);
			this.segments = this.segments.map((segment) => segment.transform.translate(translation));
			return this;
		},
		map: (divisions: number, transform: (point: Vec2, index: number, ratio: number, path: Path) => Vec2) => {
			const positions = ratioArray(divisions);
			const mappedPositions = positions.map((position, index) =>
				transform(this.get.point(position), index, position, this),
			);
			return Path.fromPoints(mappedPositions);
		},
	};

	arc(angle: number, center: Vec2): this {
		const segment = ArcSegment({ start: this.get.end(), center, angle });

		return this.add(segment);
	}

	move(destination: Vec2): this {
		const segment = MoveSegment({ start: this.get.end(), end: destination });

		return this.add(segment);
	}

	line(destination: Vec2): this {
		const segment = LineSegment({ start: this.get.end(), end: destination });

		return this.add(segment);
	}

	bez2(end: Vec2, control: Vec2): this {
		const segment = Bezier2Segment({ start: this.get.end(), control, end });
		return this.add(segment);
	}

	bez3(end: Vec2, control1: Vec2, control2: Vec2): this {
		const segment = Bezier3Segment({
			start: this.get.end(),
			control1,
			control2,
			end,
		});
		return this.add(segment);
	}

	add(segment: PathSegment): this {
		this.segments.push(segment);
		this.end = segment.end;
		return this;
	}

	static fromCircle(circle: Circle): Path {
		const startPos = circle.center.add(Vec2.unit().scale(circle.radius));
		return new Path(startPos).arc(TAU, circle.center);
	}

	static fromLine(line: Line): Path {
		return new Path(line.start).line(line.end);
	}

	static fromRect(config: RectangleConfig): Path {
		const rectangle = Rectangle(config);
		const corners = [
			new Vec2(rectangle.max.x, rectangle.min.y),
			rectangle.max,
			new Vec2(rectangle.min.x, rectangle.max.y),
		];
		return new Path(rectangle.min).line(corners[0]).line(corners[1]).line(corners[2]).line(rectangle.min);
	}

	static fromBez2(bez2: Bezier2): Path {
		return new Path(bez2.start).bez2(bez2.end, bez2.control);
	}

	static fromBez3(bez3: Bezier3): Path {
		return new Path(bez3.start).bez3(bez3.end, bez3.control1, bez3.control2);
	}

	static fromPoints(points: Vec2[]): Path {
		const path = new Path(points[0]);
		for (let i = 1; i < points.length; i++) {
			path.line(points[i]);
		}
		return path;
	}

	static from(input: Path | PathSegment): Path {
		if (input instanceof Path) {
			const path = new Path(input.start);
			input.segments.forEach((segment) => path.add(segment));
			return path;
		}
		const path = new Path(input.start);
		path.add(input);
		return path;
	}
}
