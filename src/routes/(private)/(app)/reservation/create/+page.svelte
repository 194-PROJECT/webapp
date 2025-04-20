<script lang="ts">
	import Separator from '$components/elements/separator/separator.svelte';
	import { Button } from '$components/elements/button';
	import { Input } from '$components/elements/input';
	import { Label } from '$components/elements/label';
	import EquipmentSelect from './@components/equipment-select.svelte';
	import DateTimePicker from '$components/elements/time-picker/date-time-picker.svelte';
	import { parseAbsoluteToLocal } from '@internationalized/date';
	import type { Reservation } from '$datastores/reservation/reservation.type';
	import Textarea from '$components/elements/textarea/textarea.svelte';
	import { EquipmentDatastore } from '$datastores/equipment/equipment.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import type { ActionResult } from '@sveltejs/kit';
	import { deserialize } from '$app/forms';

  let { data } = $props();
  let { authUser, equipments } = $state(data);
  // svelte-ignore state_referenced_locally
    let equipmentWithSearchTerm = $state(equipments.map(equipment => ({
    ...equipment,
    searchTerm: [equipment.name, equipment.description, equipment.category].join(' ').toLowerCase(),
    selected: false,
    amount: 1,
  })));

  let reservation: Reservation = {
    id: 0,
    userId: authUser.id,
    startDate: new Date(new Date().getTime() + 60 * 60 * 1000),
    endDate: new Date(new Date().getTime() + 60 * 60 * 2000),
    reason: '',
  }

  // Date inputs
  let startDate = $state(parseAbsoluteToLocal(reservation.startDate.toISOString()));
  let startDateString = $derived(startDate.toString());
  let endDate = $state(parseAbsoluteToLocal(reservation.endDate.toISOString()));
  let endDateString = $derived(endDate.toString());

  let loading = $state(false);

  /** 
   * @description This effect is used to validate the start and end dates of the reservation.
   * It checks if the start date is in the future and if the end date is after the start date.
   * 
   * This also updates the available equipment list based on the selected dates.
   */
  $effect(() => {
    if (startDate.toDate() < new Date()) {
      toast.error('Start date must be in the future');
      startDate = parseAbsoluteToLocal(new Date().toISOString()).add({ minutes: 30 });
    }

    if (startDate.toDate() > endDate.toDate()) {
      toast.error('End date must be after start date');
      endDate = startDate.add({ hours: 1 });
    }

    reservation.startDate = startDate.toDate();
    reservation.endDate = endDate.toDate();

    EquipmentDatastore.get({
      projection: 'available',
      extra: {
        startDate: startDate.toDate(),
        endDate: endDate.toDate(), // 7 days from now
      }
    }).then((equipmentCollection) => {
      equipments = equipmentCollection.value ?? [];
      equipmentWithSearchTerm = equipments.map(equipment => ({
        ...equipment,
        searchTerm: [equipment.name, equipment.description, equipment.category].join(' ').toLowerCase(),
        selected: false,
        amount: 1,
      }));
    });
  });

  const handleSubmit = async () => {
    loading = true;

    const payload = {
        ...reservation,
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        // Randomize the order of the equipments and select the first 'amount' items from each selected equipment
        equipments: equipmentWithSearchTerm.filter(equipment => equipment.selected).map(equipment => ({
          id: equipment.id,
          items: equipment.items?.sort(() => 0.5 - Math.random()).slice(0, equipment.amount).map(item => item.id),
        })),
      }

    const response = await fetch('?/createReservation', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const result: ActionResult = deserialize(await response.text());

    if (result.type === 'success') {
      toast.success('Reservation created successfully');
      goto('/reservation');
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

    loading = false;
  };
</script>

<div class="grid gap-4 py-4">
  <Input id="userId" name="userId" value={authUser.id} class="hidden" />

  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="startDate" class="text-right">Start Date</Label>
    <Input id="startDate" name="startDate" value={startDateString} class="hidden" />
    <DateTimePicker bind:date={startDate} class="col-span-3 justify-start text-left" />
  </div>

  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="endDate" class="text-right">End Date</Label>
    <Input id="endDate" name="endDate" value={endDateString} class="hidden" />
    <DateTimePicker bind:date={endDate} class="col-span-3 justify-start text-left" />
  </div>

  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="reason" class="text-right">Reason</Label>
    <Textarea id="reason" name="reason" bind:value={reservation.reason} class="col-span-3" placeholder="Enter the reason for reservation" />
  </div>
</div>
<Separator class="my-4" />
<EquipmentSelect bind:equipments={equipmentWithSearchTerm} />
<Separator class="my-4" />
<div class="flex items-center justify-end">
  <Button class="mr-4" onclick={() => {goto('/reservation')}} variant="destructive">
    <span>Cancel</span>
  </Button>
  <Button onclick={handleSubmit} disabled={loading}>
    <span>Submit</span>
  </Button>
</div>
