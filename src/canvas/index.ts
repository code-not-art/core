import { Vec2 } from '../math';
import BlendMode from './BlendMode';
import Draw, { ColorSelection } from './Draw';

type CanvasTransform = {
  push: () => CanvasTransform;
  pop: () => CanvasTransform;
  reset: () => CanvasTransform;
  set: (transform: DOMMatrix) => CanvasTransform;
  translate: (vector: Vec2) => CanvasTransform;
  scale: (factor: Vec2) => CanvasTransform;
  rotate: (radians: number) => CanvasTransform;
  flipHorizontal: () => CanvasTransform;
  flipVertical: () => CanvasTransform;
};

class Canvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  draw: Draw;

  private _transforms: DOMMatrix[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const maybeContext = canvas.getContext('2d');
    if (!maybeContext) {
      // Handling potential return of `undefined` - Don't ever expect this but we're playing nice with TypeScript
      // If this happens then this whole class will fail everything so might as well just throw an error and break the script.
      throw new Error('Canvas could not return 2D Context');
    }
    this.context = maybeContext;
    this.context.lineCap = 'round';

    this.draw = new Draw(maybeContext);
  }

  /**
   * Create Canvas object attached to HTML Dom element with the given ID.
   * @param canvasId HTML Element ID. Will find the element with this ID and return a Canvas object using that element.
   * TODO: Check that the element returned is a Canvas. Right now this is assumed and will break if the wrong element type is found.
   */
  static fromId(canvasId: string) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      throw new Error(`Could not find canvas element with id ${canvasId}`);
    }
    return new Canvas(canvas as HTMLCanvasElement);
  }

  get = {
    // Canvas size
    /**
     * Canvas width (in pixels)
     * @returns {number}
     */
    width: () => this.canvas.width,
    /**
     * Canvas Height (in pixels)
     * @returns {number}
     */
    height: () => this.canvas.height,
    /**
     * Minimum dimension, the lesser of width and height
     * @returns {number}
     */
    minDim: () => Math.min(this.canvas.width, this.canvas.height),
    /**
     * Maximum dimension, the greater of width and height
     * @returns {number}
     */
    maxDim: () => Math.max(this.canvas.width, this.canvas.height),
    /**
     * The ratio of width to height
     * @returns {number}
     */
    aspectRatio: () => this.canvas.width / this.canvas.height,
    size: () => new Vec2(this.canvas.width, this.canvas.height),

    // context state
    blendMode: () => this.context.globalCompositeOperation,
    transform: () => this.context.getTransform(),
  };

  set = {
    size: (width: number, height: number) => {
      this.canvas.height = height;
      this.canvas.width = width;
    },
    blendMode: (mode: BlendMode) => {
      this.context.globalCompositeOperation = mode;
    },
    transform: (transform?: DOMMatrix) => {
      this.context.setTransform(transform);
    },
  };

  // TODO: Both clear and fill need to have code that resets all context translate/rotations and then restore the previous

  /**
   * Reset the content on the canvas. Will clear all current marks and return to full transparent.
   */
  clear = () => {
    this.context.clearRect(0, 0, this.get.width(), this.get.height());
  };

  /**
   * Fill the entire canvas with a single color
   * @param color
   */
  fill = (color: ColorSelection) => {
    const storedTransform = this.context.getTransform();
    this.context.resetTransform();
    this.draw.rect({
      point: Vec2.origin(),
      height: this.get.height(),
      width: this.get.width(),
      fill: color,
    });
    this.context.setTransform(storedTransform);
  };

  transform: CanvasTransform = {
    push: (): CanvasTransform => {
      this._transforms.push(this.context.getTransform());
      return this.transform;
    },
    pop: (): CanvasTransform => {
      const storedTransform = this._transforms.pop();
      if (storedTransform) {
        this.context.setTransform(storedTransform);
      } else {
        this.context.resetTransform();
      }
      return this.transform;
    },
    reset: (): CanvasTransform => {
      this.context.resetTransform();
      return this.transform;
    },
    set: (transform: DOMMatrix): CanvasTransform => {
      this.context.setTransform(transform);
      return this.transform;
    },

    // ===== Move the draw position
    translate: (vector: Vec2): CanvasTransform => {
      this.context.translate(vector.x, vector.y);
      return this.transform;
    },
    scale: (factor: Vec2): CanvasTransform => {
      this.context.scale(factor.x, factor.y);
      return this.transform;
    },
    rotate: (radians: number): CanvasTransform => {
      this.context.rotate(radians);
      return this.transform;
    },
    flipHorizontal: (): CanvasTransform => {
      this.context.scale(-1, 1);
      return this.transform;
    },
    flipVertical: (): CanvasTransform => {
      this.context.scale(1, -1);
      return this.transform;
    },
  };

  // ===== Get and Merge layers
  layer = () => {
    // probably dont need to get doc from the canvas, could probably just use `document` but maybe there is some edge condition where this matters.
    const doc = this.canvas.ownerDocument;
    const layer = doc.createElement('canvas');

    layer.width = this.canvas.width;
    layer.height = this.canvas.height;

    return new Canvas(layer);
  };

  apply(
    layer: Canvas,
    options: { blendMode?: BlendMode; position?: Vec2; rotation?: number } = {},
  ) {
    const { blendMode, position, rotation } = options;

    const tempBlend = this.context.globalCompositeOperation;
    this.context.globalCompositeOperation = blendMode || BlendMode.default;

    const storedTransform = this.context.getTransform();
    this.context.resetTransform();
    if (rotation) {
      this.context.rotate(rotation);
    }

    const x = position ? position.x : 0;
    const y = position ? position.y : 0;

    this.context.drawImage(
      layer.canvas,
      x,
      y,
      layer.canvas.width,
      layer.canvas.height,
    );

    this.context.setTransform(storedTransform);
    this.context.globalCompositeOperation = tempBlend;
  }
}

export default Canvas;
