<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { Button } from '$components/elements/button/index.js';
  import * as Dialog from '$components/elements/dialog/index.js';
  import { Input } from '$components/elements/input/index.js';
  import { Label } from '$components/elements/label/index.js';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { toast } from 'svelte-sonner';
  import type { ReservationEquipment } from '$datastores/reservation-equipment/reservation-equipment.type';
	import type { Reservation } from '$datastores/reservation/reservation.type';
	import type { Equipment } from '$datastores/equipment/equipment.type';
	import * as Select from '$components/elements/select';
	import { EquipmentItemDatastore } from '$datastores/equipment-item/equipment-item.svelte';
	import type { EquipmentItem } from '$datastores/equipment-item/equipment-item.type';
	import { Operator } from '$core/backend/request.type';

  let {
    isOpen = $bindable(false),
    reservation = $bindable(),
    additionalData = $bindable(),
  }: {
    isOpen: boolean;
    reservation: Reservation;
    additionalData: {
      equipments: Equipment[];
    };
  } = $props();

  let initialReservationEquipment = {
    reservationId: reservation.id,
  } as Partial<ReservationEquipment>;

  let reservationEquipment = $state(structuredClone(initialReservationEquipment));
  let formLoading = $state(false);
  
  let equipmentOptions = $derived(additionalData.equipments.map((equipment) => ({
    value: equipment.id.toString(),
    label: equipment.name,
  })));
  let equipmentId = $state(additionalData.equipments[0]?.id?.toString() ?? '');
  let equipmentTriggerContent = $derived(additionalData.equipments.find((equipment) => equipment.id.toString() === equipmentId)?.name ?? 'Select Equipment');
  
  let equipmentItems: EquipmentItem[] = $state([]);
  $effect(() => {
    EquipmentItemDatastore.get({
      field: 'available',
      value: 'true',
      operator: Operator.EQUALS,
      ids: [Number(equipmentId)],
    }).then(
      (EquipmentItemCollection) => {
        equipmentItems = EquipmentItemCollection.value ?? [];
      }
    );
  });
  let equipmentItemOptions = $derived(equipmentItems.map((equipmentItem) => ({
    value: equipmentItem.id.toString(),
    label: equipmentItem.itemCode,
  })));
  // svelte-ignore state_referenced_locally
  let equipmentItemId = $state(equipmentItems[0]?.id?.toString() ?? '');
  let equipmentItemTriggerContent = $derived(equipmentItems.find((equipmentItem) => equipmentItem.id.toString() === equipmentItemId)?.itemCode ?? 'Select Equipment Item');

  const submitCreateReservationEquipment: SubmitFunction = () => {
    formLoading = true;
    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success('Reservation equipment created successfully');
        goto(location.href, {
          replaceState: true,
          noScroll: true,
          keepFocus: true,
          invalidateAll: true,
        });
        isOpen = false;
      }

      if (result.type === 'failure') {
        const error = result.data?.error;
        if (typeof error === 'string') {
          toast.error(error);
        } else if (Array.isArray(error) && error.length) {
          toast.error(error[0]);
        } else {
          toast.error('An unexpected error occurred.');
        }
      }

      formLoading = false;
    };
  };
</script>

<Dialog.Root bind:open={isOpen}>
  <Dialog.Content class="sm:max-w-[50vw]">
    <Dialog.Header>
      <Dialog.Title class="sm:text-3xl">Create Reservation Equipment</Dialog.Title>
      <Dialog.Description>
        Fill out the form below to create a new reservation equipment. Ensure all required fields are completed accurately.
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/createReservationEquipment" use:enhance={submitCreateReservationEquipment}>
      <Input id="reservationId" name="reservationId" bind:value={reservation.id} class="hidden" />
  
      <div class="grid gap-4 mb-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="equipmentId" class="text-right">Equipment</Label>
          <Input id="equipmentId" name="equipmentId" bind:value={equipmentId} class="hidden" />
          <Select.Root
            type="single"
            name="equipmentId"
            bind:value={equipmentId}
          >
            <Select.Trigger class="col-span-3">
              {equipmentTriggerContent}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.GroupHeading>Equipment</Select.GroupHeading>
                <Select.Separator />
                {#each equipmentOptions as equipmentOption (equipmentOption)}
                  <Select.Item value={equipmentOption.value} label={equipmentOption.label} />
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="equipmentItemId" class="text-right">Equipment Item</Label>
          <Input id="equipmentItemId" name="equipmentItemId" bind:value={reservationEquipment.reservationId} class="hidden" />
          <Select.Root
            type="single"
            name="equipmentItemId"
            bind:value={equipmentItemId}
          >
            <Select.Trigger class="col-span-3">
              {equipmentItemTriggerContent}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.GroupHeading>Equipment Item</Select.GroupHeading>
                <Select.Separator />
                {#each equipmentItemOptions as equipmentItemOption (equipmentItemOption)}
                  <Select.Item value={equipmentItemOption.value} label={equipmentItemOption.label} />
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="adminNote" class="text-right">Admin Note</Label>
          <Input id="adminNote" name="adminNote" class="col-span-3" />
        </div>
      </div>

      <Dialog.Footer>
        <Button type="submit" disabled={formLoading}>Add Equipment</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
