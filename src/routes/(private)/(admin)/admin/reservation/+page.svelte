<script lang="ts">
	import DataTable from './@components/reservation-data-table.svelte';
	import { reservationDataTableColumns } from './@components/reservation-data-table-columns';

  const { data } = $props();
  const {
    form,
    reservationUsers,
    rowCount,
    } = $derived(data);
</script>

<div class="">
  <DataTable data={reservationUsers ?? []} columns={reservationDataTableColumns} form={form} rowCount={rowCount}/>
</div>
