import Draw from './Draw';

class Canvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  draw: Draw;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const maybeCanvas = canvas.getContext('2d');
    if (!maybeCanvas) {
      // Handling potential return of `undefined` - Don't ever expect this but we're playing nice with TypeScript
      // If this happens then this whole class will fail everything so might as well just throw an error and break the script.
      throw new Error('Canvas could not return 2D Context');
    }
    this.context = maybeCanvas;

    this.draw = new Draw(this.context);
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
    width: () => this.canvas.width,
    height: () => this.canvas.height,
    minDim: () => Math.min(this.canvas.width, this.canvas.height),
    maxDim: () => Math.max(this.canvas.width, this.canvas.height),
    aspectRatio: () => this.canvas.width / this.canvas.height,
  };

  set = {
    size: (width: number, height: number) => {
      this.canvas.style.height = height + 'px';
      this.canvas.style.width = width + 'px';
    },
  };

  /**
   * Reset the content on the canvas. Will clear all current marks and return to full transparent.
   */
  clear = () => {
    this.context.clearRect(0, 0, this.get.width(), this.get.height());
  };
}

export default Canvas;
