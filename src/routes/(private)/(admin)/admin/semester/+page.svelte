<script lang="ts">
  import DataTable from './@components/semester-data-table.svelte';
  import { buildSemesterDataTableColumns } from './@components/semester-data-table-columns.svelte';

  const { data } = $props();
  const {
    form,
    semesterData = [],
    rowCount = 0,
  } = $derived(data);

  const additionalData: {} = $state({});
  const semesterDataTableColumns = $derived(buildSemesterDataTableColumns(additionalData));

</script>

{#key [additionalData, semesterData]}
  <div class="">
    <DataTable data={semesterData} columns={semesterDataTableColumns} form={form} rowCount={rowCount} additionalData={additionalData} />
  </div>
{/key}
