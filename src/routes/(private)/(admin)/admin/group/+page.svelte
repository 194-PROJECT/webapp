<script lang="ts">
	import DataTable from './@components/group-data-table.svelte';
	import { groupDataTableColumns } from './@components/group-data-table-columns';

  const { data } = $props();
  const {
    form,
    groupData = [],
    rowCount,
    } = $derived(data);
</script>

<div class="">
  <DataTable data={groupData} columns={groupDataTableColumns} form={form} rowCount={rowCount}/>
</div>
