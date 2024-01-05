import { Path } from '../structures/index.js';
import { Draw } from './Draw.js';

export type Brush = (props: { path: Path; draw: Draw }) => void;
