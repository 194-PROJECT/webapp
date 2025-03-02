import type { TransitionConfig } from 'svelte/transition';

export type TransitionType = 'blur' | 'crossfade' | 'draw' | 'fade' | 'fly' | 'scale' | 'slide';
export type CrossfadeConfig = [
  (node: any, params: Parameters & { key: any }) => () => TransitionConfig,
  (node: any, params: Parameters & { key: any }) => () => TransitionConfig
];

export interface Parameters {
	type: TransitionType;
	duration: number;
	delay?: number;
	speed?: number;
	easing?: (t: number) => number;
	x?: number;
	y?: number;
	opacity?: number;
  fallback?: (
		node: Element,
		params: {
			delay?: number;
			duration?: number;
			easing?: (t: number) => number;
		},
		intro: boolean,
	) => CrossfadeConfig;
}
