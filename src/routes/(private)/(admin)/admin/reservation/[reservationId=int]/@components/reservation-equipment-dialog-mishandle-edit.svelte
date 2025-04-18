<script lang="ts">
  import { deserialize, enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { Button } from '$components/elements/button';
  import * as Dialog from '$components/elements/dialog';
  import { Input } from '$components/elements/input';
  import { Label } from '$components/elements/label';
	import * as Select from '$components/elements/select';
	import type { EquipmentImage } from '$datastores/equipment-image/equipment-image.type';
	import type { EquipmentItem } from '$datastores/equipment-item/equipment-item.type';
	import type { Equipment } from '$datastores/equipment/equipment.type';
  import { MishandleType, type ReservationEquipment } from '$datastores/reservation-equipment/reservation-equipment.type';
	import type { Reservation } from '$datastores/reservation/reservation.type';
	import { snakeToParagraph } from '$lib/utils';
  import type { ActionResult } from '@sveltejs/kit';
  import { toast } from 'svelte-sonner';

  let {
    isOpen = $bindable(false),
    reservation = $bindable(),
    reservationEquipment = $bindable()
  }: {
    isOpen: boolean;
    reservation: Reservation;
    reservationEquipment: {
      reservationEquipment: ReservationEquipment;
      equipmentItem: EquipmentItem | undefined;
      equipment: Equipment | undefined;
      equipmentImage: EquipmentImage | undefined;
    },
  } = $props();

  let formLoading = $state(false);
  let mishandled = $state(reservationEquipment.reservationEquipment.mishandled);
  let mishandleDescription = $state(reservationEquipment.reservationEquipment.mishandleDescription);
  let mishandleType = $state(reservationEquipment.reservationEquipment.mishandleType);
  let mishandleTypeTriggerContent = $derived(
    mishandleType
      ? snakeToParagraph(mishandleType)
      : 'Select Mishandle Type'
  );

  const updateReservationEquipment = async () => {
    const response = await fetch(`?/updateReservationEquipment`, {
      method: "POST",
      body: JSON.stringify({
        id: reservationEquipment.reservationEquipment.id,
        mishandled: mishandled,
        mishandleType: mishandleType,
        mishandleDescription: mishandleDescription,
      }),
    });

    const result: ActionResult = deserialize(await response.text());

    switch (result.type) {
      case "success": {
        toast.success(result.data?.message ?? "Reservation updated successfully.");
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
</script>

<Dialog.Root bind:open={isOpen}>
  <Dialog.Content class="sm:max-w-[50vw]">
    <Dialog.Header>
      <Dialog.Title class="sm:text-3xl">{reservationEquipment.equipmentItem?.itemCode}</Dialog.Title>
      <Dialog.Description>
        Make changes to the reservation equipment's mishandle information. 'Save changes' to apply.
      </Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <Input id="id" name="id" value={reservationEquipment.reservationEquipment.id} class="hidden" />

      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="mishandled" class="text-right">Mishandled</Label>
        <Input id="mishandled" name="mishandled" type="checkbox" bind:value={mishandled} class="col-span-3 w-10" />
      </div>

      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="mishandleType" class="text-right">Type</Label>
        <Select.Root type="single" name="mishandleType" bind:value={mishandleType} disabled={!mishandled}>
          <Select.Trigger class="col-span-3">{mishandleTypeTriggerContent}</Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each Object.values(MishandleType) as type}
                <Select.Item value={String(type)} label={snakeToParagraph(type)} />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>

      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="mishandleDescription" class="text-right">Description</Label>
        <Input id="mishandleDescription" name="mishandleDescription" bind:value={mishandleDescription} class="col-span-3" disabled={!mishandled} />
      </div>
    </div>

    <Dialog.Footer>
      <Button disabled={formLoading} onclick={updateReservationEquipment}>Save changes</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
