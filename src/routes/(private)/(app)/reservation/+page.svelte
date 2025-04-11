<script lang="ts">
	import ReservationTable from "./@components/reservation-table.svelte";

  let { data } = $props();
  let { reservations } = $derived(data);
</script>

<ReservationTable {reservations} />