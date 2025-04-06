<script lang="ts">
	import DataTable from './@components/group-data-table.svelte';
	import { buildGroupDataTableColumns } from './@components/group-data-table-columns.svelte';
	import { onMount } from 'svelte';
	import { SemesterDatastore } from '$datastores/semester/semester.svelte';
	import { CourseDatastore } from '$datastores/course/course.svelte';
	import { ClassDatastore } from '$datastores/class/class.svelte';
	import type { Semester } from '$datastores/semester/semester.type';
	import type { Course } from '$datastores/course/course.type';
	import type { Class } from '$datastores/class/class.type';

  const { data } = $props();
  const {
    form,
    groupData = [],
    rowCount = 0,
    } = $derived(data);
  
  const additionalData: {
    semesters: Semester[];
    courses: Course[];
    classes: Class[];
  } = $state({
    semesters: [],
    courses: [],
    classes: [],
  });

  const groupDataTableColumns = $derived(buildGroupDataTableColumns(additionalData));

  onMount(async () => {
    const semesterCollection = await SemesterDatastore.get({order_by: 'id', order_direction: 'DESC'});
    const courseCollection = await CourseDatastore.get({order_by: 'id', order_direction: 'DESC'});
    const classCollection = await ClassDatastore.get({order_by: 'id', order_direction: 'DESC'});
    additionalData.semesters = semesterCollection.value ?? [];
    additionalData.courses = courseCollection.value ?? [];
    additionalData.classes = classCollection.value ?? [];
  });

</script>

{#key [additionalData, groupData]}
  <div class="">
    <DataTable data={groupData} columns={groupDataTableColumns} form={form} rowCount={rowCount} additionalData={additionalData} />
  </div>
{/key}