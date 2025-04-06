<script lang="ts">
	import DataTable from './@components/class-data-table.svelte';
	import { buildClassDataTableColumns } from './@components/class-data-table-columns.svelte';
	import { onMount } from 'svelte';
	import { SemesterDatastore } from '$datastores/semester/semester.svelte';
	import { CourseDatastore } from '$datastores/course/course.svelte';
	import type { Semester } from '$datastores/semester/semester.type';
	import type { Course } from '$datastores/course/course.type';
	import { UserDatastore } from '$datastores/user/user.svelte';
	import { Operator } from '$core/backend/request.type';
	import type { User } from '$datastores/user/user.type';

  const { data } = $props();
  const {
    form,
    classData = [],
    rowCount = 0,
    } = $derived(data);
  
  const additionalData: {
    semesters: Semester[];
    instructors: User[];
    courses: Course[];
  } = $state({
    semesters: [],
    instructors: [],
    courses: [],
  });

  const groupDataTableColumns = $derived(buildClassDataTableColumns(additionalData));

  onMount(async () => {
    const semesterCollection = await SemesterDatastore.get({order_by: 'id', order_direction: 'DESC'});
    const instructorCollection = await UserDatastore.get({
      order_by: 'id',
      order_direction: 'DESC',
      field: 'type',
      value: 'faculty',
      operator: Operator.EQUALS,
    });
    const courseCollection = await CourseDatastore.get({order_by: 'id', order_direction: 'DESC'});
    additionalData.semesters = semesterCollection.value ?? [];
    additionalData.instructors = instructorCollection.value ?? [];
    additionalData.courses = courseCollection.value ?? [];
  });

</script>

{#key [additionalData, classData]}
  <div class="">
    <DataTable data={classData} columns={groupDataTableColumns} form={form} rowCount={rowCount} additionalData={additionalData} />
  </div>
{/key}