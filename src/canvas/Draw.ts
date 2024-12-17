import tinycolor from 'tinycolor2';

import { Color } from '../color/index.js';
import { TAU } from '../constants.js';
import Vec2 from '../math/Vec2.js';
import { Path } from '../structures/path/Path.js';
import { BlendMode } from './BlendMode.js';
import { Brush } from './Brush.js';
import { Canvas } from './Canvas.js';
import { SegmentTypes } from '../structures/path/PathSegment.js';
import { Rectangle, RectangleConfig } from '../structures/Rectangle.js';

export type ColorSelection = Color | string | tinycolor.Instance;
export type FillSelection = ColorSelection | CanvasGradient | CanvasPattern;

function resolveColorSelection(selection: ColorSelection) {
	if (selection instanceof Color) {
		return selection;
	} else if (typeof selection === 'string') {
		return new Color(selection);
	} else {
		return new Color(selection.toRgbString());
	}
}

function resolveFillStyle(selection: FillSelection) {
	return selection instanceof CanvasGradient || selection instanceof CanvasPattern
		? selection
		: resolveColorSelection(selection).rgb();
}

export type Stroke = {
	color: ColorSelection;
	width: number;
	cap?: 'round' | 'butt' | 'square';
};

type Styles = {
	fill?: FillSelection;
	stroke?: Stroke;
	brush?: Brush;
};

export type Bezier2 = {
	start: Vec2;
	control: Vec2;
	end: Vec2;
};

export type Bezier3 = {
	start: Vec2;
	control1: Vec2;
	control2: Vec2;
	end: Vec2;
};

export type Circle = {
	center: Vec2;
	radius: number;
};

export type Line = {
	start: Vec2;
	end: Vec2;
};

export class Draw {
	context: CanvasRenderingContext2D;
	constructor(context: CanvasRenderingContext2D) {
		this.context = context;
	}

	/* *****
	 * Every draw method sets up the geometry that will be drawn on the canvas context and then executes the stroke and fill on that geometry
	 * Since this behaviour is repeated we'll capture it in these two private methods
	 * Then we'll introduce draw(stroke, fill) which can be used to execute both methods
	 * Note that fill is executed before stroke so that any outlines will appear on top on the canvas.
	 */
	private draw(stroke?: Stroke, fill?: FillSelection) {
		this.fill(fill);
		this.stroke(stroke);
	}
	private fill(fill?: FillSelection) {
		if (fill) {
			this.context.fillStyle = resolveFillStyle(fill);
			this.context.fill();
		}
	}
	private stroke(stroke?: Stroke) {
		if (stroke) {
			const color = resolveColorSelection(stroke.color);
			this.context.lineWidth = stroke.width;
			this.context.strokeStyle = color.rgb();
			if (stroke.cap) {
				this.context.lineCap = stroke.cap;
			}
			this.context.stroke();
		}
	}

	// -- Different geometries below
	circle(circle: Circle, styles: Styles) {
		this.context.beginPath();
		this.context.arc(circle.center.x, circle.center.y, circle.radius, 0, TAU);
		this.context.closePath();
		this.draw(styles.stroke, styles.fill);
		styles.brush && styles.brush({ path: Path.fromCircle(circle), draw: this });
	}

	// TODO: Expand rect to also handle rounded corners. Probably want to take advantage of Path API once written.
	rect(rectangleConfig: Rectangle | RectangleConfig, styles: Styles) {
		const rectangle = Rectangle(rectangleConfig);
		// Map all corners except the start
		const corners = [
			new Vec2(rectangle.max.x, rectangle.min.y),
			rectangle.max,
			new Vec2(rectangle.min.x, rectangle.max.y),
		];

		this.context.beginPath();
		this.context.moveTo(rectangle.min.x, rectangle.min.y);
		corners.forEach((corner) => {
			// Move to each corner
			this.context.lineTo(corner.x, corner.y);
		});
		this.context.closePath();
		this.draw(styles.stroke, styles.fill);
		styles.brush && styles.brush({ path: Path.fromRect(rectangleConfig), draw: this });
	}

	line(line: Line, styles: Styles) {
		const { start, end } = line;
		const { stroke, fill, brush } = styles;
		this.context.beginPath();
		this.context.moveTo(start.x, start.y);
		this.context.lineTo(end.x, end.y);
		this.draw(stroke, fill);
		brush && brush({ path: Path.fromLine(line), draw: this });
	}

	bezier2(inputs: Bezier2 & Styles) {
		const { start, control, end, stroke, fill } = inputs;
		this.context.beginPath();
		this.context.moveTo(start.x, start.y);
		this.context.quadraticCurveTo(control.x, control.y, end.x, end.y);
		this.draw(stroke, fill);
		inputs.brush && inputs.brush({ path: Path.fromBez2(inputs), draw: this });
	}

	bezier3(inputs: Bezier3 & Styles) {
		const { start, control1, control2, end, stroke, fill } = inputs;
		this.context.beginPath();
		this.context.moveTo(start.x, start.y);
		this.context.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, end.x, end.y);
		this.draw(stroke, fill);
		inputs.brush && inputs.brush({ path: Path.fromBez3(inputs), draw: this });
	}

	path(
		path: Path,
		config: {
			close?: boolean;
		} & Styles,
	) {
		const { fill, stroke, close = false } = config;
		this.context.beginPath();
		this.context.moveTo(path.get.start().x, path.get.start().y);
		path.get.segments().forEach((segment) => {
			switch (segment.type) {
				case SegmentTypes.Move:
					this.context.moveTo(segment.end.x, segment.end.y);
					break;
				case SegmentTypes.Line:
					this.context.lineTo(segment.end.x, segment.end.y);
					break;
				case SegmentTypes.Arc:
					const startAngle = segment.start.diff(segment.center).angle();
					const counterClockwise = segment.angle <= 0;
					const endAngle = counterClockwise ? startAngle + segment.angle : startAngle + segment.angle;
					this.context.arc(segment.center.x, segment.center.y, segment.radius, startAngle, endAngle, counterClockwise);
					break;
				case SegmentTypes.Bezier2:
					this.context.quadraticCurveTo(segment.control.x, segment.control.y, segment.end.x, segment.end.y);
					break;
				case SegmentTypes.Bezier3:
					this.context.bezierCurveTo(
						segment.control1.x,
						segment.control1.y,
						segment.control2.x,
						segment.control2.y,
						segment.end.x,
						segment.end.y,
					);
					break;
				default:
					console.warn(`core.draw.path`, `segment switch hit default due to unhandled segment type:`, segment);
			}
		});
		if (close) {
			this.context.closePath();
		}
		this.draw(stroke, fill);
		config.brush && config.brush({ path, draw: this });
	}

	points(
		points: Vec2[],
		styles: {
			close?: boolean;
			stroke?: Stroke;
			fill?: ColorSelection;
			brush?: Brush;
		},
	) {
		const path = new Path(points[0]);
		points.slice(1).forEach((point) => path.line(point));
		this.path(path, styles);
	}

	layer(options: { size?: Vec2 } = {}): Canvas {
		const doc = this.context.canvas.ownerDocument;
		const transform = this.context.getTransform();
		const element = doc.createElement('canvas');
		element.width = options.size ? options.size.x : this.context.canvas.width;
		element.height = options.size ? options.size.y : this.context.canvas.height;

		const output = new Canvas(element);
		output.context.setTransform(transform);
		return output;
	}

	stamp(inputs: { source: Canvas; blendMode?: BlendMode; position?: Vec2; rotation?: number }) {
		const { source, blendMode, position, rotation } = inputs;

		const tempBlend = this.context.globalCompositeOperation;
		this.context.globalCompositeOperation = blendMode || BlendMode.default;

		const storedTransform = this.context.getTransform();

		this.context.resetTransform();
		if (rotation) {
			this.context.rotate(-rotation);
		}

		const x = position ? position.x : 0;
		const y = position ? position.y : 0;

		this.context.drawImage(source.canvas, x, y, source.get.width(), source.get.height());

		this.context.setTransform(storedTransform);
		this.context.globalCompositeOperation = tempBlend;
	}
}
