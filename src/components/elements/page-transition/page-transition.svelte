<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TransitionConfig } from 'svelte/transition';
	import type { TransitionType, Parameters, CrossfadeConfig } from './types';
	import { blur, crossfade, draw, fade, fly, scale, slide } from 'svelte/transition';

	let {
		key,
		children,
		inParams = {
			type: 'fade',
			duration: 300,
			delay: 300,
			y: 100
		},
		outParams = {
			type: 'fade',
			duration: 300,
			y: 100
		}
	}: {
		key: string;
		children: Snippet;
		inParams?: Parameters;
		outParams?: Parameters;
		type?: TransitionType;
	} = $props();

	/**
	 * TODO: Implement crossfade and draw transitions
	 *
	 * case 'crossfade':
	 *   return crossfade({
	 *     ...params,
	 *     fallback: params.fallback,
	 *   });
	 * case 'draw':
	 *  return draw(node as SVGElement & { getTotalLength(): number; }, params);
	 */
	function getTransition(node: Element, { type, ...params }: Parameters): TransitionConfig {
		switch (type) {
			case 'blur':
				return blur(node, params);
			case 'fade':
				return fade(node, params);
			case 'fly':
				return fly(node, params);
			case 'scale':
				return scale(node, params);
			case 'slide':
				return slide(node, params);
			default:
				return fade(node, params);
		}
	}
</script>

{#if key !== undefined}
	{#key key}
		<div in:getTransition={inParams} out:getTransition={outParams}>
			{@render children()}
		</div>
	{/key}
{/if}
