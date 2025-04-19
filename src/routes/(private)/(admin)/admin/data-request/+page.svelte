<script lang="ts">
	import DataTable from './@components/reservation-equipment-data-table.svelte';
	import { reservationDataTableColumns } from './@components/reservation-equipment-data-table-columns';

  const { data } = $props();
  const {
    form,
    reservationEquipment,
    rowCount,
    } = $derived(data);
</script>

<div class="">
  <DataTable data={reservationEquipment ?? []} columns={reservationDataTableColumns} form={form} rowCount={rowCount}/>
</div>
