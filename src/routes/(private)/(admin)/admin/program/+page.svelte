<script lang="ts">
	import DataTable from './@components/program-data-table.svelte';
	import { buildProgramDataTableColumns } from './@components/program-data-table-columns.svelte';
	import { onMount } from 'svelte';
	import { ProgramDatastore } from '$datastores/program/program.svelte';
	import type { Program } from '$datastores/program/program.type';
	import type { Department } from '$datastores/department/department.type';
	import { DepartmentDatastore } from '$datastores/department/department.svelte';

	const { data } = $props();
	const {
		form,
		programData = [],
		rowCount = 0,
	} = $derived(data);

	const additionalData: {
		departments: Department[];
	} = $state({
		departments: [],
	});

	const programDataTableColumns = $derived(buildProgramDataTableColumns(additionalData));

	onMount(async () => {
		const departmentCollection = await DepartmentDatastore.get({ order_by: 'id', order_direction: 'DESC' });
		additionalData.departments = departmentCollection.value ?? [];
	});
</script>

{#key [additionalData, programData]}
	<div class="">
		<DataTable data={programData} columns={programDataTableColumns} form={form} rowCount={rowCount} additionalData={additionalData} />
	</div>
{/key}
