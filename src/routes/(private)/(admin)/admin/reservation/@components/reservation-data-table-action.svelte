<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import { Button } from "$components/elements/button/index.js";
  import * as DropdownMenu from "$components/elements/dropdown-menu/index.js";
  import type { ReservationUser } from "$datastores/reservation/reservation.type";
  import ReservationDialogEdit from "./reservation-dialog-edit.svelte";
	import { goto } from "$app/navigation";
	import type { ActionResult } from "@sveltejs/kit";
	import { deserialize } from "$app/forms";
	import { toast } from "svelte-sonner";
  import * as AlertDialog from "$components/elements/alert-dialog";

  let { reservationUser = $bindable() }: { reservationUser: ReservationUser } = $props();
  let isEditDialogOpen = $state(false);
  let isDeleteDialogOpen = $state(false);

  let reservationFinished = $derived.by(() => {
    return reservationUser.accepted === true
    && reservationUser.returned === true
    && reservationUser.claimed === true;
  });

  let reservationOnGoing = $derived.by(() => {
    return reservationUser.accepted === true
    && reservationUser.returned === false
    && reservationUser.claimed === true;
  });

  const viewReservation = () => {
    goto(`/admin/reservation/${reservationUser.id}`);
  }

  const toggleEditDialog = () => {
    isEditDialogOpen = !isEditDialogOpen;
  }
 
  const toggleDeleteDialog = () => {
    isDeleteDialogOpen = !isDeleteDialogOpen;  
  }

  const approveReservation = async (accepted: boolean) => {
    const response = await fetch(`?/approveReservation`, {
      method: "POST",
      body: JSON.stringify({
        id: reservationUser.id,
        accepted: accepted,
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

  const deleteReservation = async () => {
    const response = await fetch(`?/deleteReservation`, {
      method: "POST",
      body: JSON.stringify({ id: reservationUser.id }),
    });

    const result: ActionResult = deserialize(await response.text());

    switch (result.type) {
      case "success": {
        toast.success(result.data?.message ?? "Reservation deleted successfully.");
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

    toggleDeleteDialog();
  };

  const toggleClaimedReservation = async () => {
    const response = await fetch(`?/toggleClaimedReservation`, {
      method: "POST",
      body: JSON.stringify({
        id: reservationUser.id,
        claimed: !reservationUser.claimed,
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
        id: reservationUser.id,
        returned: !reservationUser.returned,
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

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="ghost"
        size="icon"
        class="relative size-8 p-0"
      >
        <span class="sr-only">Open menu</span>
        <Ellipsis />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item onclick={viewReservation}>View reservation</DropdownMenu.Item>
    <DropdownMenu.Item onclick={toggleEditDialog}>Edit reservation</DropdownMenu.Item>
    <DropdownMenu.Item onclick={toggleDeleteDialog}>Delete reservation</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item onclick={() => {approveReservation(true)}} disabled={reservationFinished || reservationOnGoing}>Approve</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => {approveReservation(false)}} disabled={reservationFinished || reservationOnGoing}>Reject</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item onclick={() => {toggleClaimedReservation()}} disabled={!reservationUser.accepted || reservationFinished}>Toggle Claimed</DropdownMenu.Item>
    <DropdownMenu.Item onclick={() => {toggleReturnedReservation()}} disabled={!reservationUser.claimed}>Toggle Returned</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<ReservationDialogEdit bind:isOpen={isEditDialogOpen} reservationUser={reservationUser} />
<AlertDialog.Root bind:open={isDeleteDialogOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete the reservation and remove its data from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action onclick={deleteReservation}>Continue</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
