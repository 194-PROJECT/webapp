<script lang="ts">
	import DataTable from './@components/course-data-table.svelte';
	import { buildClassDataTableColumns } from './@components/course-data-table-columns.svelte';
	import { onMount } from 'svelte';
	import { CourseDatastore } from '$datastores/course/course.svelte';
	import type { Course } from '$datastores/course/course.type';
	import { ProgramDatastore } from '$datastores/program/program.svelte';
	import type { Program } from '$datastores/program/program.type';

  const { data } = $props();
  const {
    form,
    courseData = [],
    rowCount = 0,
    } = $derived(data);
  
  const additionalData: {
    programs: Program[];
  } = $state({
    programs: [],
  });

  const groupDataTableColumns = $derived(buildClassDataTableColumns(additionalData));

  onMount(async () => {
    const programCollection = await ProgramDatastore.get({order_by: 'id', order_direction: 'DESC'});
    additionalData.programs = programCollection.value ?? [];
  });

</script>

{#key [additionalData, courseData]}
  <div class="">
    <DataTable data={courseData} columns={groupDataTableColumns} form={form} rowCount={rowCount} additionalData={additionalData} />
  </div>
{/key}
