import { Path } from '../structures';
import { Draw } from './Draw';

export type Brush = (props: { path: Path; draw: Draw }) => void;
