import Vec2 from '../math/Vec2.js';
import { repeat } from '../utils/index.js';
export type GridTile = {
  uv: Vec2; // uv coords of center, from 0-1
  origin: Vec2; // top left coords
  center: Vec2; // center
  size: Vec2; // width and height of tile
  row: number;
  column: number;
  firstRow: boolean;
  lastRow: boolean;
  firstColumn: boolean;
  lastColumn: boolean;
};
export type GridOptions = {
  columns: number;
  rows: number;
  size?: Vec2; // default Vec2.ones()
};
export const grid = (options: GridOptions): GridTile[] => {
  const output: GridTile[] = [];
  const tileSize = Vec2.ones()
    .scale(options.size || 1)
    .scale(new Vec2(1 / options.columns, 1 / options.rows));
  repeat(options.rows, (row) => {
    repeat(options.columns, (column) => {
      const uv = new Vec2(
        column / (options.columns - 1 || 1),
        row / (options.rows - 1 || 1),
      );
      const origin = uv.scale(options.size || 1);
      output.push({
        uv,
        origin,
        center: origin.add(tileSize.scale(0.5)),
        size: tileSize,
        row,
        column,
        firstRow: row === 0,
        lastRow: row === options.rows - 1,
        firstColumn: column === 0,
        lastColumn: column === options.columns - 1,
      });
    });
  });
  return output;
};
