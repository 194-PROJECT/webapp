<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import { Button } from "$components/elements/button/index.js";
  import * as DropdownMenu from "$components/elements/dropdown-menu/index.js";
	import { goto } from "$app/navigation";
	import type { ActionResult } from "@sveltejs/kit";
	import { deserialize } from "$app/forms";
	import { toast } from "svelte-sonner";
	import type { ReservationEquipment } from "$datastores/reservation-equipment/reservation-equipment.type";
	import type { EquipmentItem } from "$datastores/equipment-item/equipment-item.type";
	import type { EquipmentImage } from "$datastores/equipment-image/equipment-image.type";
	import type { Equipment } from "$datastores/equipment/equipment.type";
	import type { Reservation } from "$datastores/reservation/reservation.type";
	import ReservationEquipmentDialogMishandleEdit from "./reservation-equipment-dialog-mishandle-edit.svelte";
	import { isReservationFinished } from "$datastores/reservation/reservation.helper.svelte";

  let {
    reservation = $bindable(),
    reservationEquipment = $bindable(),
  }: {
    reservation: Reservation;
    reservationEquipment: {
      reservationEquipment: ReservationEquipment;
      equipmentItem: EquipmentItem | undefined;
      equipment: Equipment | undefined;
      equipmentImage: EquipmentImage | undefined;
    },
    additionalData: {
      equipments: Equipment[];
    };
  } = $props();
  let isMishandleEditDialogOpen = $state(false);

  const viewEquipment = () => {
    goto(`/admin/equipment/${reservationEquipment.equipment?.id}`);
  }

  const deleteReservationEquipment = async () => {
    const response = await fetch(`?/deleteReservationEquipment`, {
      method: "POST",
      body: JSON.stringify({ id: reservationEquipment.reservationEquipment.id }),
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
  };

  const updateReservationEquipment = async (data: Partial<ReservationEquipment>) => {
    const response = await fetch(`?/updateReservationEquipment`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result: ActionResult = deserialize(await response.text());

    switch (result.type) {
      case "success": {
        toast.success(result.data?.message ?? "Reservation updated successfully.");
        reservationEquipment.reservationEquipment = {
          ...reservationEquipment.reservationEquipment,
          ...data,
        }
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
  };

  const toggleMishandleEditDialog = () => {
    isMishandleEditDialogOpen = !isMishandleEditDialogOpen;
  };
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
    <DropdownMenu.Item onclick={viewEquipment}>View</DropdownMenu.Item>
    <DropdownMenu.Item onclick={deleteReservationEquipment} disabled={isReservationFinished(reservation)}>Remove</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item onclick={()=>{
      updateReservationEquipment({
        id: reservationEquipment.reservationEquipment.id,
        returned: !reservationEquipment.reservationEquipment.returned,
      });
    }} disabled={!isReservationFinished(reservation)}>Returned</DropdownMenu.Item>
    <DropdownMenu.Item onclick={toggleMishandleEditDialog} disabled={!isReservationFinished(reservation)}>Mishandled</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<ReservationEquipmentDialogMishandleEdit
  bind:isOpen={isMishandleEditDialogOpen}
  bind:reservation={reservation}
  bind:reservationEquipment={reservationEquipment}
/>
