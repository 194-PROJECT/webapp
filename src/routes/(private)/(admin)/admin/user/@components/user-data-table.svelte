<script lang="ts" generics="TData, TValue">
	import { type ColumnDef, getCoreRowModel, type PaginationState } from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$components/elements/data-table/index.js';
	import { deserialize } from '$app/forms';
	import * as Table from '$components/elements/table/index.js';
	import Button from '$components/elements/button/button.svelte';
	import * as Select from '$components/elements/select';
  import type { User } from "$datastores/user/user.type";
	import type { ActionResult } from '@sveltejs/kit';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { z } from 'zod';
	import type { getModelSchema } from '$core/helpers/request';
	import { goto, invalidateAll } from '$app/navigation';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { camelToSnakeCase } from '$lib/utils';
	import { Operator } from '$core/backend/request.type';
	import Input from '$components/elements/input/input.svelte';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
	};

	let {
		data,
		columns,
		form,
		rowCount,
	}: DataTableProps<TData, TValue> & {
		form: SuperValidated<z.infer<typeof getModelSchema>>;
		rowCount?: number;
	} = $props();

	const pageSizes = [
		{ value: '10', label: '10' },
		{ value: '20', label: '20' },
		{ value: '50', label: '50' },
		{ value: '100', label: '100' }
	];

	// Pagination
	let pageSize = $state(form.data.pageSize ?? pageSizes[0].value);
	let pageCount = $derived(Math.ceil((rowCount ?? 0) / Number(pageSize)));
	let pageIndex = $derived.by(() => {
		const pageIndex = Number(form.data.pageIndex) !== undefined ? Number(form.data.pageIndex) : 1;
		return Math.min(pageCount - 1, Math.max(0, pageIndex - 1));
	});
  let pageDivider = 10;

	let pagination = $derived<PaginationState>({
		pageIndex: Number(pageIndex),
		pageSize: Number(pageSize)
	});

	let pageSizeTriggerContent = $derived(pageSizes.find((f) => f.value === pageSize)?.label ?? 'Page size');

	let table = createSvelteTable({
		get data() {
			return data;
		},
		get rowCount() {
			return rowCount;
		},
		get columns() {
			return columns;
		},
		get state() {
			return { pagination };
		},
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true
	});

  let searchBy: keyof User = $state('email');
  let searchValue: string = $state('');
  const searchOptions: { value: keyof User, label: string }[] = [
    { value: 'email', label: 'Email' },
    { value: 'username', label: 'Username' },
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'type', label: 'Type' },
    { value: 'role', label: 'Role' },
  ];

  let searchByTriggerContent = $derived(searchOptions.find((f) => f.value === searchBy)?.label ?? 'Search by');

	// Fetch page data
	async function getPageData(selectedPageIndex: number) {
		const formData = new FormData();

    formData.append('field', camelToSnakeCase(searchBy));
    formData.append('operator', Operator.LIKE);
    formData.append('value', searchValue);
		formData.append('pageSize', pageSize);
		formData.append('pageIndex', String(selectedPageIndex + 1));

		const response = await fetch('?/getPageData', {
			method: 'POST',
			body: formData
		});

		const result: ActionResult = deserialize(await response.text());

		// Reload the page if redirect is set
		if (result.type === 'success' && result.data?.redirect) {
			goto(result.data.redirect, { replaceState: true, noScroll: true, keepFocus: true }).then(() => {
				invalidateAll();
			});
		}
	}
</script>

<div class="flex items-center space-x-2 p-4">
  <Select.Root
		type="single"
		name="pageSize"
		bind:value={searchBy}
		onValueChange={(v) => getPageData(pageIndex)}
	>
		<Select.Trigger class="w-[180px]">
			{searchByTriggerContent}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.GroupHeading>Search by</Select.GroupHeading>
				{#each searchOptions as searchOption (searchOption.value)}
					<Select.Item value={searchOption.value} label={searchOption.label} />
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
  <div class="flex-grow">
    <Input
      type="text"
      placeholder={searchBy}
      class="max-w-xs"
      bind:value={searchValue}
      onkeydown={(e) => e.key === "Enter" && getPageData(pageIndex)}
    />
  </div>
	<Select.Root
		type="single"
		name="pageSize"
		bind:value={pageSize}
		onValueChange={(v) => getPageData(pageIndex)}
	>
		<Select.Trigger class="w-[180px]">
			{pageSizeTriggerContent}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.GroupHeading>Page size</Select.GroupHeading>
				{#each pageSizes as pageSize (pageSize.value)}
					<Select.Item value={pageSize.value} label={pageSize.label} />
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>
<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header (header.id)}
						<Table.Head>
							{#if !header.isPlaceholder}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each table.getRowModel().rows as row (row.id)}
				<Table.Row data-state={row.getIsSelected() && 'selected'}>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell>
							<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
<div class="flex items-center justify-end space-x-2 p-4">
	<div class="flex flex-grow flex-row">
		{#if pageIndex > pageDivider}
			<Button variant="outline" size="sm" onclick={() => getPageData(0)}>1</Button>
		{/if}
    {#if pageIndex > pageDivider + 1}
      <Ellipsis class="m-2 h-auto" />
    {/if}
		{#each Array.from({ length: pageCount }, (_, i) => i).slice(Math.max(0, pageIndex - pageDivider), Math.min(pageCount, pageIndex + (pageDivider + 1))) as page (page)}
			<Button
				variant="outline"
				size="sm"
				onclick={() => getPageData(page)}
				disabled={pageIndex === page}
			>
				{page + 1}
			</Button>
		{/each}
    {#if pageIndex < pageCount - (pageDivider + 2)}
      <Ellipsis class="m-2 h-auto" />
    {/if}
		{#if pageIndex < pageCount - (pageDivider + 1)}
			<Button variant="outline" size="sm" onclick={() => getPageData(pageCount - 1)}>
				{pageCount}
			</Button>
		{/if}
	</div>
	<div>
		<span class="text-sm">Page {pageIndex + 1} of {pageCount}</span>
	</div>
	<Button
		variant="outline"
		size="sm"
		onclick={() => getPageData(pageIndex - 1)}
		disabled={pageIndex === 0}
	>
		Previous
	</Button>
	<Button
		variant="outline"
		size="sm"
		onclick={() => getPageData(pageIndex + 1)}
		disabled={pageIndex === pageCount - 1}
	>
		Next
	</Button>
</div>
