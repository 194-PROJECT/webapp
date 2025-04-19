<script lang="ts">
  import { deserialize, enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { Button } from '$components/elements/button';
  import * as Dialog from '$components/elements/dialog';
  import { Input } from '$components/elements/input';
  import { Label } from '$components/elements/label';
	import DateTimePicker from '$components/elements/time-picker/date-time-picker.svelte';
	import type { EquipmentImage } from '$datastores/equipment-image/equipment-image.type';
	import type { EquipmentItem } from '$datastores/equipment-item/equipment-item.type';
	import type { Equipment } from '$datastores/equipment/equipment.type';
  import { type ReservationEquipment } from '$datastores/reservation-equipment/reservation-equipment.type';
	import type { Reservation } from '$datastores/reservation/reservation.type';
	import { parseAbsoluteToLocal } from '@internationalized/date';
  import type { ActionResult, SubmitFunction } from '@sveltejs/kit';
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
  let dataRequested = $state(reservationEquipment.reservationEquipment.dataRequested);
  let dataRequestDate = $state(parseAbsoluteToLocal(
    (reservationEquipment.reservationEquipment.dataRequestDate ?? new Date()).toISOString()
  ));
  let dataRequestDescription = $state(reservationEquipment.reservationEquipment.dataRequestDescription);

  const requestEquipmentData = async () => {
    formLoading = true;
    const response = await fetch(`?/requestEquipmentData`, {
      method: "POST",
      body: JSON.stringify({
        id: reservationEquipment.reservationEquipment.id,
        dataRequested: dataRequested,
        dataRequestDate: dataRequestDate.toDate(),
        dataRequestDescription: dataRequestDescription,
      }),
    });

    const result: ActionResult = deserialize(await response.text());

    switch (result.type) {
      case "success": {
        toast.success(result.data?.message ?? "Reservation updated successfully.");
        await goto(location.href, {
          replaceState: true,
          noScroll: true,
          keepFocus: true,
          invalidateAll: true,
        });
        break;
      }
      case "failure":
        const error = result.data?.error;
        if (typeof error === 'string') {
          toast.error(error);
        } else if (Array.isArray(error) && error.length) {
          toast.error(error[0]);
        } else {
          toast.error('An unexpected error occurred.');
        }
        break;
    }

    formLoading = false;
  };
</script>

<Dialog.Root bind:open={isOpen}>
  <Dialog.Content class="sm:max-w-[50vw]">
    <Dialog.Header>
      <Dialog.Title class="sm:text-3xl">{reservationEquipment.equipment?.name}</Dialog.Title>
      <Dialog.Description>
        Request data for {reservationEquipment.equipmentItem?.itemCode} from {reservationEquipment.equipment?.name}. 'Save changes' to apply.
      </Dialog.Description>
    </Dialog.Header>

      <div class="grid gap-4 py-4">
        <Input id="id" name="id" value={reservationEquipment.reservationEquipment.id} class="hidden" />

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="dataRequested" class="text-right">Data Request</Label>
          <Input id="dataRequested" name="dataRequested" type="checkbox" bind:value={dataRequested} class="col-span-3 w-10" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="dataRequestDate" class="text-right">Request By</Label>
          <DateTimePicker bind:date={dataRequestDate} class="col-span-3 justify-start text-left" disabled={!dataRequested} />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="dataRequestDescription" class="text-right">Description</Label>
          <Input id="dataRequestDescription" name="dataRequestDescription" bind:value={dataRequestDescription} class="col-span-3" disabled={!dataRequested} />
        </div>
      </div>

      <Dialog.Footer>
        <Button disabled={formLoading} onclick={requestEquipmentData}>Save changes</Button>
      </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
