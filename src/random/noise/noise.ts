export type Noise2D = (x: number, y: number) => number;
export type Noise3D = (x: number, y: number, z: number) => number;
export type Noise4D = (x: number, y: number, z: number, w: number) => number;

export type NoiseWrapOptions = {
	x?: boolean;
	y?: boolean;
	z?: boolean;
	w?: boolean;
};
export type NoiseOptions = {
	amplitude?: number;
	frequency?: number;
	octaves?: number[];
	wrap?: NoiseWrapOptions;
};
