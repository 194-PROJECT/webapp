<script lang="ts">
	import type { BarGraphData } from "$datastores/analytics/analytics.type";
	import { scaleLinear } from "d3-scale";

  let {
    dataset,
    title = 'Bar',
  }: {
    dataset: BarGraphData[];
    title?: string;
  } = $props();

	let xTicks = $derived(dataset.map((d) => d.name));
  let yTicks = $derived.by(() => {
    const max = Math.max(...dataset.map((d) => d.total));
    const min = Math.min(...dataset.map((d) => d.total));
    const step = Math.ceil((max - min) / 5);
    return Array.from({ length: 6 }, (_, i) => Math.round(min + i * step));
  });
	let padding = $derived({ top: 20, right: 15, bottom: 20, left: 45 });

	let width = $state(500);
	let height = $state(200);

	function formatMobile(tick: number | string) {
		return `'${tick.toString().slice(-2)}`;
	}

  let xScale = $derived(
    scaleLinear()
      .domain([0, xTicks.length])
      .range([padding.left, width - padding.right])
  );

	let yScale = $derived(
    scaleLinear()
		.domain([0, Math.max.apply(null, yTicks)])
		.range([height - padding.bottom, padding.top])
  );

	let innerWidth = $derived(width - (padding.left + padding.right));
	let barWidth = $derived(innerWidth / xTicks.length);
</script>

<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
  <svg>
    <!-- y axis -->
    <g class="axis y-axis">
      {#each yTicks as tick}
        <g class="text-xs" transform="translate(0, {yScale(tick)})">
          <text
            stroke="none"
            font-size="12"
            orientation="left"
            width="60"
            height="310"
            x="57"
            y="-4"
            fill="#888888"
            text-anchor="end"><tspan x="36" dy="0.355em">{tick}</tspan></text
          >
        </g>
      {/each}
    </g>

    <!-- x axis -->
    <g class="axis x-axis">
      {#each dataset as point, i}
        <g class="text-xs" transform="translate({xScale(i)},{height})">
          <text
            stroke="none"
            font-size="12"
            orientation="bottom"
            width="531"
            height="30"
            x={barWidth / 2}
            y="-15"
            fill="#888888"
            text-anchor="middle"
            ><tspan x={barWidth / 2} dy="0.71em"
              >{width > 380 ? point.name : formatMobile(point.name)}</tspan
            ></text
          >
        </g>
      {/each}
    </g>

    <g>
      {#each dataset as point, i}
        <rect
          class="bg-primary-foreground"
          x={xScale(i) + 2}
          y={yScale(point.total)}
          width={barWidth - 8}
          height={yScale(0) - yScale(point.total)}
          fill="currentColor"
          rx="4"
          ry="4"
        />
      {/each}
    </g>
  </svg>
</div>

<style>
	.chart {
		width: 100%;
		margin: 0 auto;
	}

	svg {
		position: relative;
		width: 100%;
		height: 350px;
	}

	rect {
		max-width: 51px;
	}
</style>
