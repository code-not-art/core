# Brush

Every canvas draw function takes two arguments: first the shape or structure that defines where to draw on teh canvas, and second is the styles to apply to that location. HTML canvas provides some simple line (stroke) and fill properties that all draw functions expose. 

In addition to these default style settings, every draw function can also be provided a `Brush`. The purpose of a brush is to combine multiple canvas drawing actions into a single function, so that when the Brush is used to draw a shape or path, a series of effects can be applied on the canvas at that location.

As an example, we could create a brush to fill a shape with a dithered dot pattern, or a brush that will draw a path with a glow or shadow effect.

By creating a Brush that encapsulates a set of draw actions, we can reuse that pattern for multiple paths in a sketch.

## Creating a Brush

A brush is defined in [./src/canvas/Brush.ts](../src/canvas/Brush.ts) by the type:

```ts
type Brush = (props: { path: Path; draw: Draw }) => void;
```

To create a Brush for reuse we simply define a function to this specification:

```ts
import { type Brush } from '@code-not-art/core';

const myBrush: Brush = (props) => {
	const {draw, path} = props;
	
	// Draw actions to take along path
	// ...
}
```

For a concrete example, let's look at a brush that draws a series of black dots (small filled circles) along a path at an even interval:

```ts
import { type Brush, Utils } from '@code-not-art/core';

const { repeat } = Utils;

/**
 * Brush to draw dots along the length of the path.
 *
 * Dots will be radius 15 black circles spaced every 50 pixels.
 */
const dottedLineBrush: Brush = (props) => {
	const { draw, path } = props;

	// Get the length of the path and define our spacing (distance between dots)
	const length = path.get.length();
	const dotSpacing = 50;

	// Since the spacing and path are fixed, we can get the total number of dots
	// then draw a circle for each dot
	const dotCount = length / dotSpacing;
	repeat(Math.floor(dotCount), (i) => {

		// calculate center of a dot based on position along the path
		const position = path.get.point((i * dotSpacing) / length);

		// draw the dot!
		draw.circle({ center: position, radius: 15 }, { fill: 'black' });
	});
};
```

You could use this brush in a draw function like the following, where we use this `dottedLineBrush` to draw the path of a `Rectangle`.

```ts
const draw: SketchDraw<{}, {}> = ({ canvas, }, _data) => {
		canvas.draw.rectangle(
		{ 
			min: canvas.get.position(0.2, 0.2), 
			max: canvas.get.position(0.8, 0.8) 
		}, 
		{ brush: dottedLineBrush }
	);
};
```

To take this construction a step farther, let's consider how to make this brush into a reusable tool where we can define some parameters of the dotted line. For example we may want to change the color, spacing, and size of the dots. While the code-not-art library does not have any influence on how to construct this, the following pattern achieves this well. If we change our previous function to return the actual brush, we can pass in configuration properties:

```ts
type DottedLineBrushConfig = {
	fill?: FillSelection;
	radius?: number;
	dotSpacing?: number;
};

/**
 * Brush to draw dots along the length of the path.
 *
 * Dots will be radius 15 black circles spaced every 50 pixels.
 */
const dottedLineBrush: (config?: DottedLineBrushConfig) => Brush = (config) => (props) => {
	const { draw, path } = props;

	const fill = config?.fill || 'black';
	const dotSpacing = config?.dotSpacing || 50;
	const radius = config?.radius || 15;

	const length = path.get.length();

	const dotCount = length / dotSpacing;
	repeat(Math.floor(dotCount), (i) => {
		// calculate center of a dot based on position along the path
		const position = path.get.point((i * dotSpacing) / length);

		// draw the dot!
		draw.circle({ center: position, radius }, { fill });
	});
};
```

Finally, you can configure your dot brush and use it similar to before but with one additional step:

```ts
const draw: SketchDraw<{}, {}> = ({ canvas, palette }, _data) => {
		// Define a brush configured for this sketch
		const dotBrush = dottedLineBrush({
			fill: palette.colors[0],
			dotSpacing: canvas.get.minDim() / 50,
			radius: canvas.get.minDim() / 200,
		});

		// Draw a rectangle using our brush
		canvas.draw.rectangle(
		{ 
			min: canvas.get.position(0.2, 0.2), 
			max: canvas.get.position(0.8, 0.8) 
		}, 
		{ brush: dotBrush }
	);
};
```

