<script lang="ts">
	import DataTable from './@components/equipment-data-table.svelte';
	import { equipmentDataTableColumns } from './@components/equipment-data-table-columns';

  const { data } = $props();
  const { form, equipment, rowCount } = $derived(data);
</script>

<div class="">
  <DataTable data={equipment ?? []} columns={equipmentDataTableColumns} form={form} rowCount={rowCount}/>
</div>
