<script lang="ts">
	import { Bar } from "$components/blocks/charts";
	import { BarAxisOrientation } from "$components/blocks/charts/bar.type.js";
	import Separator from "$components/elements/separator/separator.svelte";

  let { data } = $props();
  let {
    authUser,
  } = $derived(data);

  let currentMonth = new Date().toLocaleString("default", {
    month: "long",
  });
</script>

<p class="text-2xl font-bold">Equipment Report</p>
<Separator class="mb-4" />
