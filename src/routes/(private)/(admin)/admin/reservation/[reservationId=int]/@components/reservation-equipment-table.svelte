<script lang="ts">
	import { goto } from '$app/navigation';
	import { Header } from '$components/elements/alert-dialog';
	import * as Avatar from '$components/elements/avatar';
  import Button from '$components/elements/button/button.svelte';
	import * as Table from '$components/elements/table';
	import type { EquipmentImage } from '$datastores/equipment-image/equipment-image.type';
	import type { Equipment } from '$datastores/equipment/equipment.type';
	import type { ReservationEquipment } from '$datastores/reservation-equipment/reservation-equipment.type';

	const {
    reservationEquipments,
		equipments,
		equipmentImages,
	}: {
    reservationEquipments: ReservationEquipment[];
		equipments: Equipment[];
		equipmentImages: Record<number, EquipmentImage>;
	} = $props();

  const reservationEquipmentDetails = $derived.by(() => {
    const details: Record<number, ReservationEquipment> = {};
      equipments.forEach((equipment) => {
        const detail = reservationEquipments.find((reservationEquipment) => reservationEquipment.equipmentId === equipment.id);
        if (detail) {
          details[equipment.id] = detail;
        }
    });

    return details;
  });

  const viewEquipment = (equipmentId?: number) => {
    if (equipmentId) {
      goto(`/admin/equipment/${equipmentId}`);
    } else {
      console.error('No equipment ID provided');
    }
  };
</script>

<Header class="mb-4">
  <h2 class="text-2xl font-bold">Equipments</h2>
</Header>
<Table.Root>
  <Table.Caption>List of reservation equipments</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="text-left">ID</Table.Head>
      <Table.Head class="text-left"></Table.Head>
      <Table.Head>Category</Table.Head>
      <Table.Head>Name</Table.Head>
      <Table.Head>Description</Table.Head>
      <Table.Head>Price</Table.Head>
      <Table.Head>Quantity</Table.Head>
      <Table.Head>Returned</Table.Head>
      <Table.Head>Mishandled</Table.Head>
      <Table.Head></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each equipments as equipment (equipment)}
			<Table.Row>
				<Table.Cell class="font-medium">{equipment.id}</Table.Cell>
        <Table.Cell>
          <Avatar.Root class="h-8 w-8 rounded-lg">
            <Avatar.Image src={equipmentImages[equipment.id].imageUrl} alt={equipment.name} />
            <Avatar.Fallback class="rounded-lg">{equipment.name.slice(0,1)}</Avatar.Fallback>
          </Avatar.Root>
        </Table.Cell>
        <Table.Cell>{equipment.category}</Table.Cell>
        <Table.Cell>{equipment.name}</Table.Cell>
        <Table.Cell>{equipment.description}</Table.Cell>
        <Table.Cell>{equipment.price} PHP</Table.Cell>
        <Table.Cell>{reservationEquipmentDetails[equipment.id].quantity}</Table.Cell>
        <Table.Cell>{reservationEquipmentDetails[equipment.id].returned}</Table.Cell>
        <Table.Cell>{reservationEquipmentDetails[equipment.id].mishandled}</Table.Cell>
				<Table.Cell>
          <Button onclick={() => viewEquipment(equipment.id)}>
            <span>View Equipment</span>
          </Button>
        </Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
