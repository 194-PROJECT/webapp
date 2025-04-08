<script lang="ts">
	import * as Avatar from "$components/elements/avatar";
	import Button from "$components/elements/button/button.svelte";
	import * as Card from "$components/elements/card";
	import Separator from "$components/elements/separator/separator.svelte";
	import type { ActionResult } from "@sveltejs/kit";
	import type { PageProps } from "./$types";
	import EquipmentReservationTable from "./@components/reservation-equipment-table.svelte";
	import { deserialize } from "$app/forms";
	import { toast } from "svelte-sonner";

  let { data }: PageProps = $props();
  let {
    reservation,
    reservationEquipments,
    equipments,
    equipmentImages,
    reserver,
    admin
  } = $state(data);

  const numberOfItems = $derived(reservationEquipments.length);

  const approveReservation = async (accepted: boolean) => {
    const response = await fetch(`?/approveReservation`, {
      method: "POST",
      body: JSON.stringify({
        id: reservation.id,
        accepted: accepted,
      }),
    });

    const result: ActionResult = deserialize(await response.text());

    switch (result.type) {
      case "success": {
        reservation.accepted = accepted;
        toast.success(result.data?.message ?? "Accept state updated.");
        break;
      }
      case "failure":
        toast.error(result.data?.error ?? "An error occurred.");
        break;
    }
  }
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
	<Card.Root>
		<Card.Content>
			<Card.Title class="text-2xl font-bold mb-4">Reservation {reservation.id}</Card.Title>
			<p class="text-1xl"><span class="font-bold">Reason:</span> {reservation.reason}</p>
      <Separator class="my-4" />
      <div class="flex items-center">
        <p class="text-1xl flex-grow font-bold">Start date:</p>
        <p class="text-1xl">{reservation.startDate.toLocaleString()}</p>
      </div>
      <div class="flex items-center">
        <p class="text-1xl flex-grow font-bold">End date:</p>
        <p class="text-1xl">{reservation.endDate.toLocaleString()}</p>
      </div>
      <div class="flex items-center">
        <p class="text-1xl flex-grow font-bold">Total items:</p>
        <p class="text-1xl">{numberOfItems}</p>
      </div>
		</Card.Content>
	</Card.Root>
  <Card.Root>
		<Card.Content>
			<Card.Title class="text-1xl font-bold flex items-center">
        <p class="flex-grow">Reservee Details</p>
        <Button variant="link" class="text-sm p-0" href={`/admin/user/${reservation.userId}`}>View Profile</Button>
      </Card.Title>
      <div>
        <Separator class="my-4" />
        <div class="flex items-center">
          <p class="text-1xl flex-grow">Reserved by:</p>
          <p class="text-1xl">{reserver ? reserver.firstName + ' ' + reserver.lastName : 'User not found'}</p>
        </div>
        <div class="flex items-center">
          <p class="text-1xl flex-grow">Account type:</p>
          <p class="text-1xl">{reserver ? reserver.type : 'User not found'}</p>
        </div>
      </div>
      <Separator class="my-4" />
      <div class="flex items-center gap-4">
        <Avatar.Root class="h-8 w-8 rounded-lg">
          <Avatar.Image src={reserver?.profilePictureUrl} alt={reserver?.firstName} />
          <Avatar.Fallback class="rounded-lg"
            >{(reserver?.firstName?.charAt(0) || '') + (reserver?.lastName?.charAt(0) || '')}</Avatar.Fallback
          >
        </Avatar.Root>
        <p class="text-1xl flex-grow">{reserver ? reserver.username : 'User not found'}</p>
        <Button variant="link" class="text-sm p-0" href={`mailto:${reserver?.email}`}>Email</Button>
      </div>
		</Card.Content>
	</Card.Root>
  <Card.Root>
		<Card.Content>
      <Card.Title class="text-1xl mb-4">Accept Status: <span class="">{ reservation.accepted === true ? "ACCEPTED" : reservation.accepted === false ? "REJECTED" : "PENDING" }</span></Card.Title>
      <Separator class="my-4" />
      <div>
        <div class="flex items-center">
          <p class="text-1xl flex-grow">Accepted by:</p>
          <p class="text-1xl">{admin ? admin.firstName + ' ' + admin.lastName : 'User not found'}</p>
        </div>
        <div class="flex items-center">
          <p class="text-1xl flex-grow">Account type:</p>
          <p class="text-1xl">{reserver ? reserver.type : 'User not found'}</p>
        </div>
      </div>
      <Separator class="my-4" />
      <div>
        <div class="flex items-center">
          <p class="text-1xl flex-grow">Return date:</p>
          <p class="text-1xl">{reservation.returnDate?.toDateString()}</p>
        </div>
      </div>
      <Separator class="my-4" />
      <div class="flex gap-4 width-full flex-row-reverse">
        <Button onclick={()=>{approveReservation(true)}}>Approve</Button>
        <Button onclick={()=>{approveReservation(false)}}>Reject</Button>
      </div>
		</Card.Content>
	</Card.Root>
  <Card.Root>
		<Card.Content>
      <Card.Title class="text-1xl mb-4">Reservation Notes</Card.Title>
      <Separator class="my-4" />
      <p class="text-1xl mb-2"><span class="font-bold">Admin Note:</span> {reservation.adminNote}</p>
      <p class="text-1xl"><span class="font-bold">Return Note:</span> {reservation.returnNote}</p>
		</Card.Content>
	</Card.Root>
</div>
<EquipmentReservationTable
  reservationEquipments={reservationEquipments}
  equipments={equipments}
  equipmentImages={equipmentImages}
/>