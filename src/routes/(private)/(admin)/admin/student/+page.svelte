<script lang="ts">
	import DataTable from './@components/student-data-table.svelte';
	import { studentDataTableColumns } from './@components/student-data-table-columns';

  const { data } = $props();
  const {
    form,
    studentUsers,
    rowCount,
    } = $derived(data);
</script>

<div class="">
  <DataTable data={studentUsers ?? []} columns={studentDataTableColumns} form={form} rowCount={rowCount}/>
</div>
