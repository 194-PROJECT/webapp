<script lang="ts">
  import DataTable from './@components/department-data-table.svelte';
  import { buildDepartmentDataTableColumns } from './@components/department-data-table-columns.svelte';

  const { data } = $props();
  const {
    form,
    departmentData = [],
    rowCount = 0,
  } = $derived(data);

  const additionalData: {} = $state({});
  const departmentDataTableColumns = $derived(buildDepartmentDataTableColumns(additionalData));

</script>

{#key [additionalData, departmentData]}
  <div class="">
    <DataTable data={departmentData} columns={departmentDataTableColumns} form={form} rowCount={rowCount} additionalData={additionalData} />
  </div>
{/key}
