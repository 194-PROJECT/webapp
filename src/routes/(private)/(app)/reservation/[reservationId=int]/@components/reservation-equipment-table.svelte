<script lang="ts">
	import { Header } from '$components/elements/alert-dialog';
	import * as Avatar from '$components/elements/avatar';
	import * as Table from '$components/elements/table';
	import type { EquipmentImage } from '$datastores/equipment-image/equipment-image.type';
	import type { EquipmentItem } from '$datastores/equipment-item/equipment-item.type';
	import { EquipmentDatastore } from '$datastores/equipment/equipment.svelte';
	import type { Equipment } from '$datastores/equipment/equipment.type';
	import type { ReservationEquipment } from '$datastores/reservation-equipment/reservation-equipment.type';
	import ReservationEquipmentTableAction from './reservation-equipment-table-action.svelte';
	import { onMount } from 'svelte';
	import type { Reservation } from '$datastores/reservation/reservation.type';
	import { snakeToParagraph } from '$lib/utils';

	let {
    reservation = $bindable(),
    reservationEquipments = $bindable(),
	}: {
    reservation: Reservation;
    reservationEquipments: {
      reservationEquipment: ReservationEquipment;
      equipmentItem: EquipmentItem | undefined;
      equipment: Equipment | undefined;
      equipmentImage: EquipmentImage | undefined;
    }[];
	} = $props();

  let additionalData: {
    equipments: Equipment[];
  } = $state({
    equipments: [],
  });

  let isCreateDialogOpen = $state(false);

  onMount(async () => {
    const equipmentCollection = await EquipmentDatastore.get({});
    additionalData.equipments = equipmentCollection.value ?? [];
  });
</script>

<div class="flex items-center justify-between mb-4">
  <Header class="mb-4">
    <h2 class="text-2xl font-bold">Equipments</h2>
  </Header>
</div>
<Table.Root>
  <Table.Caption>List of reservation equipments</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="text-left">ID</Table.Head>
      <Table.Head class="text-left"></Table.Head>
      <Table.Head>Category</Table.Head>
      <Table.Head>Name</Table.Head>
      <Table.Head>Item Code</Table.Head>
      <Table.Head>Rating</Table.Head>
      <Table.Head>Comment</Table.Head>
      <Table.Head>Admin Note</Table.Head>
      <Table.Head>Returned</Table.Head>
      <Table.Head>Mishandled</Table.Head>
      <Table.Head>Mishandle Type</Table.Head>
      <Table.Head>Mishandle Description</Table.Head>
      <Table.Head>Data Requested</Table.Head>
      <Table.Head>Data Request Date</Table.Head>
      <Table.Head>Data Request Description</Table.Head>
      <Table.Head>Data Received</Table.Head>
      <Table.Head></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each reservationEquipments as reservationEquipment (reservationEquipment)}
			<Table.Row>
				<Table.Cell class="font-medium">{reservationEquipment.reservationEquipment.id}</Table.Cell>
        <Table.Cell>
          <Avatar.Root class="h-8 w-8 rounded-lg">
            <Avatar.Image src={reservationEquipment.equipmentImage?.imageUrl} alt={reservationEquipment.equipment?.name} />
            <Avatar.Fallback class="rounded-lg">{reservationEquipment.equipment?.name.slice(0,1)}</Avatar.Fallback>
          </Avatar.Root>
        </Table.Cell>
        <Table.Cell>{reservationEquipment.equipment?.category}</Table.Cell>
        <Table.Cell>{reservationEquipment.equipment?.name}</Table.Cell>
        <Table.Cell>{reservationEquipment.equipmentItem?.itemCode}</Table.Cell>
        <Table.Cell>{reservationEquipment.reservationEquipment.rating}</Table.Cell>
        <Table.Cell>{reservationEquipment.reservationEquipment.comment}</Table.Cell>
        <Table.Cell>{reservationEquipment.reservationEquipment.adminNote}</Table.Cell>
        <Table.Cell>{reservationEquipment.reservationEquipment.returned}</Table.Cell>
        <Table.Cell>{reservationEquipment.reservationEquipment.mishandled}</Table.Cell>
        <Table.Cell>{reservationEquipment.reservationEquipment.mishandleType}</Table.Cell>
        <Table.Cell>{reservationEquipment.reservationEquipment.mishandleDescription}</Table.Cell>
        <Table.Cell>{reservationEquipment.reservationEquipment.dataRequested}</Table.Cell>
        <Table.Cell>{reservationEquipment.reservationEquipment.dataRequestDate?.toLocaleString()}</Table.Cell>
        <Table.Cell>{reservationEquipment.reservationEquipment.dataRequestDescription}</Table.Cell>
        <Table.Cell>{reservationEquipment.reservationEquipment.dataReceived}</Table.Cell>
        <Table.Cell>{
          reservationEquipment.reservationEquipment.mishandleType ?
            snakeToParagraph(reservationEquipment.reservationEquipment.mishandleType) : undefined
        }</Table.Cell>
        <Table.Cell>{reservationEquipment.reservationEquipment.mishandleDescription}</Table.Cell>
				<Table.Cell>
          <ReservationEquipmentTableAction
            reservation={reservation}
            reservationEquipment={reservationEquipment}
            additionalData={additionalData}
          />
        </Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>