<script lang="ts">
	import { Bar } from "$components/blocks/charts";
	import { BarAxisOrientation } from "$components/blocks/charts/bar.type.js";
	import Separator from "$components/elements/separator/separator.svelte";

  let { data } = $props();
  let {
    authUser,
    reservationMadePerMonth,
    reservationMadePerDay,
    reservationAverageDuration,
    reservationLeadTimeDistribution,
    reservationReturnDelayDistribution,
  } = $derived(data);

  let currentMonth = new Date().toLocaleString("default", {
    month: "long",
  });
</script>

<p class="text-2xl font-bold">Reservation Report</p>
<Separator class="mb-4" />
<div class="flex flex-col justify-between space-y-4 mb-12">
  <p class="text-small font-bold self-end mr-4">Average Duration (Hours)</p>
  <Bar dataset={reservationAverageDuration} orientation={BarAxisOrientation.VERTICAL} padding={{top: 20, right: 15, bottom: 45, left: 45 }} />
</div>
<Separator class="mb-4" />
<div class="flex flex-col justify-between space-y-4 mb-12">
  <p class="text-small font-bold self-end mr-4">Reservation per Month</p>
  <Bar dataset={reservationMadePerMonth} />
</div>
<Separator class="mb-4" />
<div class="flex flex-col justify-between space-y-4">
  <p class="text-small font-bold self-end mr-4">Reservation per Day | {currentMonth}</p>
  <Bar dataset={reservationMadePerDay} />
</div>
<Separator class="mb-4" />
<div class="flex flex-col justify-between space-y-4 mb-12">
  <p class="text-small
    font-bold self-end mr-4">Reservation Lead Time Distribution</p>
  <Bar dataset={reservationLeadTimeDistribution} orientation={BarAxisOrientation.VERTICAL} padding={{top: 20, right: 15, bottom: 60, left: 45 }} />
</div>
<Separator class="mb-4" />
<div class="flex flex-col justify-between space-y-4 mb-12">
  <p class="text-small
    font-bold self-end mr-4">Reservation Return Delay Distribution</p>
  <Bar dataset={reservationReturnDelayDistribution} orientation={BarAxisOrientation.VERTICAL} padding={{top: 20, right: 15, bottom: 60, left: 45 }} />
</div>
