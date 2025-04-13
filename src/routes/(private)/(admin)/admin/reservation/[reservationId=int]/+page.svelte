<script lang="ts">
	import * as Avatar from "$components/elements/avatar";
	import Button from "$components/elements/button/button.svelte";
	import * as Card from "$components/elements/card";
	import Separator from "$components/elements/separator/separator.svelte";
	import type { ActionResult } from "@sveltejs/kit";
	import type { PageProps } from "./$types";
	import ReservationEquipmentTable from "./@components/reservation-equipment-table.svelte";
	import { deserialize } from "$app/forms";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";
	import {
    canApproveReservation,
    getReservationStatus,
    isReservationFinished,
    isReservationOngoing
  } from "$datastores/reservation/reservation.helper.svelte";

  let { data }: PageProps = $props();
  let {
    reservation,
    reservationEquipments,
    reserver,
    admin
  } = $derived(data);

  const numberOfItems = $derived(reservationEquipments.length);
  let acceptStatus = $derived(
    reservation.accepted === true ? "ACCEPTED" :
    reservation.accepted === false ? "REJECTED" : "PENDING"
  );

  let reservationStatus = $derived(getReservationStatus(reservation));
  let reservationFinished = $derived(isReservationFinished(reservation));
  let reservationOnGoing = $derived(isReservationOngoing(reservation));
  let canApprove = $derived(canApproveReservation(reservation));

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
        toast.success(result.data?.message ?? "Accept state updated.");
        goto(location.href, {
          replaceState: true,
          noScroll: true,
          keepFocus: true,
          invalidateAll: true,
        });
        break;
      }
      case "failure":
        toast.error(result.data?.error ?? "An error occurred.");
        break;
    }
  }

  const toggleClaimedReservation = async () => {
    const response = await fetch(`?/toggleClaimedReservation`, {
      method: "POST",
      body: JSON.stringify({
        id: reservation.id,
        claimed: !reservation.claimed,
      }),
    });

    const result: ActionResult = deserialize(await response.text());

    switch (result.type) {
      case "success": {
        toast.success(result.data?.message ?? "Claimed state updated.");
        goto(location.href, {
          replaceState: true,
          noScroll: true,
          keepFocus: true,
          invalidateAll: true,
        });
        break;
      }
      case "failure":
        toast.error(result.data?.error ?? "An error occurred.");
        break;
    }
  }

  const toggleReturnedReservation = async () => {
    const response = await fetch(`?/toggleReturnedReservation`, {
      method: "POST",
      body: JSON.stringify({
        id: reservation.id,
        returned: !reservation.returned,
      }),
    });

    const result: ActionResult = deserialize(await response.text());

    switch (result.type) {
      case "success": {
        toast.success(result.data?.message ?? "Return state updated.");
        goto(location.href, {
          replaceState: true,
          noScroll: true,
          keepFocus: true,
          invalidateAll: true,
        });
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
      <p class="text-1xl break-words"><span class="font-bold">Reason:</span> {reservation.reason}</p>
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
      <Card.Title class="text-1xl mb-4">Accept Status: <span class="">{ acceptStatus }</span></Card.Title>
      <Separator class="my-4" />
      <div>
        <div class="flex items-center">
          <p class="text-1xl flex-grow">Last updated by:</p>
          <p class="text-1xl">{admin ? admin.firstName + ' ' + admin.lastName : 'Not yet updated'}</p>
        </div>
        <div class="flex items-center">
          <p class="text-1xl flex-grow">Updated on:</p>
          <p class="text-1xl">{reservation.updatedAt?.toLocaleString() ?? 'Not yet updated'}</p>
        </div>
      </div>
      <Separator class="my-4" />
      <div class="flex gap-2 flex-wrap width-full flex-row-reverse">
        <Button onclick={()=>{approveReservation(true)}} disabled={reservationFinished || reservationOnGoing || !canApprove}>Approve</Button>
        <Button onclick={()=>{approveReservation(false)}} disabled={reservationFinished || reservationOnGoing  || !canApprove}>Reject</Button>
      </div>
		</Card.Content>
	</Card.Root>

  <Card.Root>
		<Card.Content>
      <Card.Title class="text-1xl mb-4">Reservation Status: <span class="">{ reservationStatus.toUpperCase() }</span></Card.Title>
      <Separator class="my-4" />
      <div>
        <div class="flex items-center">
          <p class="text-1xl flex-grow">Return date:</p>
          <p class="text-1xl">{reservation.returnDate?.toDateString()}</p>
        </div>
      </div>
      <Separator class="my-4" />
      <div class="flex gap-2 flex-wrap width-full flex-row-reverse">
        <Button onclick={toggleClaimedReservation} disabled={!reservation.accepted || reservationFinished}>Claimed</Button>
        <Button onclick={toggleReturnedReservation} disabled={!reservation.claimed || reservationFinished}>Returned</Button>
      </div>
		</Card.Content>
	</Card.Root>
</div>

<ReservationEquipmentTable
  reservation={reservation}
  reservationEquipments={reservationEquipments}
/>
