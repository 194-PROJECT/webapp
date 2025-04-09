<script lang="ts">
	import { Header } from '$components/elements/alert-dialog';
	import Button from '$components/elements/button/button.svelte';
	import * as Table from '$components/elements/table';
	import type { EquipmentItem } from '$datastores/equipment-item/equipment-item.type';
	import type { Equipment } from '$datastores/equipment/equipment.type';
	import EquipmentItemDialogCreate from './equipment-item-dialog-create.svelte';
	import EquipmentItemTableAction from './equipment-item-table-action.svelte';

	const {
    equipment = $bindable(),
    equipmentItems = $bindable(),
  }: {
    equipment: Equipment
    equipmentItems: EquipmentItem[],
  } = $props();

  let isCreateDialogOpen = $state(false);

  const toggleCreateDialog = () => {
    isCreateDialogOpen = true;
  } 
</script>


<div class="flex items-center justify-between">
  <Header class="mb-4 flex-grow">
    <h2 class="text-2xl font-bold">Equipment Items</h2>
  </Header>
  <Button variant="outline" size="sm" class="ml-auto" onclick={toggleCreateDialog}>
    <span>Add Equipment Item</span>
  </Button>
</div>
<Table.Root>
  <Table.Caption>List of equipment items</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="text-left">ID</Table.Head>
			<Table.Head>Item Code</Table.Head>
			<Table.Head>Available</Table.Head>
			<Table.Head>Created At</Table.Head>
			<Table.Head>Updated At</Table.Head>
			<Table.Head></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each equipmentItems as item, index}
			<Table.Row>
				<Table.Cell class="font-medium">{item.id}</Table.Cell>
				<Table.Cell>{item.itemCode}</Table.Cell>
				<Table.Cell>{item.available ? "Yes" : "No"}</Table.Cell>
				<Table.Cell>{item.createdAt?.toLocaleString() ?? "N/A"}</Table.Cell>
				<Table.Cell>{item.updatedAt?.toLocaleString() ?? "N/A"}</Table.Cell>
				<Table.Cell>
          <EquipmentItemTableAction bind:equipmentItem={equipmentItems[index]} />
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

<EquipmentItemDialogCreate bind:isOpen={isCreateDialogOpen} bind:equipmentId={equipment.id} />