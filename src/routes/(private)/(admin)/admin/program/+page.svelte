<script lang="ts">
	import DataTable from './@components/program-data-table.svelte';
	import { buildProgramDataTableColumns } from './@components/program-data-table-columns.svelte';
	import { onMount } from 'svelte';
	import { ProgramDatastore } from '$datastores/program/program.svelte';
	import type { Program } from '$datastores/program/program.type';

	const { data } = $props();
	const {
		form,
		programData = [],
		rowCount = 0,
	} = $derived(data);

	const additionalData: {
		programs: Program[];
	} = $state({
		programs: [],
	});

	const programDataTableColumns = $derived(buildProgramDataTableColumns(additionalData));

	onMount(async () => {
		const programCollection = await ProgramDatastore.get({ order_by: 'id', order_direction: 'DESC' });
		additionalData.programs = programCollection.value ?? [];
	});
</script>

{#key [additionalData, programData]}
	<div class="">
		<DataTable data={programData} columns={programDataTableColumns} form={form} rowCount={rowCount} additionalData={additionalData} />
	</div>
{/key}
