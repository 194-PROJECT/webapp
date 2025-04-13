<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$components/elements/button';
	import * as Dialog from '$components/elements/dialog';
	import { Input } from '$components/elements/input';
	import { Label } from '$components/elements/label';
	import type { ReservationUser } from '$datastores/reservation/reservation.type';
	import { getDateInput } from '$lib/utils';
	import { parseAbsoluteToLocal, parseDateTime } from '@internationalized/date';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import * as Select from '$components/elements/select';
	import DateTimePicker from '$components/elements/time-picker/date-time-picker.svelte';

	let {
		isOpen = $bindable(false),
		reservationUser = $bindable()
	}: {
		isOpen: boolean;
		reservationUser: ReservationUser;
	} = $props();

  let updatedReservationUser = $derived(structuredClone(reservationUser));
  let formLoading = $state(false);

  let accepted = $state(String(reservationUser.accepted));
  let claimed = $state(String(reservationUser.claimed));
  let returned = $state(String(reservationUser.returned));

  // Date inputs
  let startDate = $state(parseAbsoluteToLocal(reservationUser.startDate.toISOString()));
  let startDateString = $derived(startDate.toString());
  let endDate = $state(parseAbsoluteToLocal(reservationUser.endDate.toISOString()));
  let endDateString = $derived(endDate.toString());
  let returnDate = $state(reservationUser.returnDate ? parseAbsoluteToLocal(reservationUser.returnDate.toISOString()) : undefined);
  let returnDateString = $derived(returnDate && returned ? returnDate.toString() : undefined);

  const submitUpdateReservation: SubmitFunction = () => {
    formLoading = true;

    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success(result.data?.form.message ?? 'Reservation updated successfully');
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
    }
  }
</script>

<Dialog.Root bind:open={isOpen}>
  <Dialog.Content class="sm:max-w-[50vw]">
    <Dialog.Header>
      <Dialog.Title class="sm:text-2xl">Reservation by: {updatedReservationUser.firstName} {updatedReservationUser.lastName}</Dialog.Title>
      <Dialog.Description>
        Make changes to the reservation's information. 'Save changes' to apply.
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/updateReservation" use:enhance={submitUpdateReservation}>
      <div class="grid gap-4 py-4">
        <Input id="id" name="id" value={updatedReservationUser.id} class="hidden" />

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
          <Label for="accepted" class="text-right">Accepted</Label>
          <Input id="accepted" name="accepted" value={accepted} class="hidden" />
          <Select.Root
            type="single"
            name="pageSize"
            bind:value={accepted}
          >
            <Select.Trigger class="col-span-3"> 
              {accepted}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Item value={'true'} label={'true'} />
                <Select.Item value={'false'} label={'false'} />
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="claimed" class="text-right">Claimed</Label>
          <Input id="claimed" name="claimed" value={claimed} class="hidden" />
          <Select.Root
            type="single"
            name="pageSize"
            bind:value={claimed}
          >
            <Select.Trigger class="col-span-3"> 
              {claimed}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Item value={'true'} label={'true'} />
                <Select.Item value={'false'} label={'false'} />
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="returned" class="text-right">Returned</Label>
          <Input id="returned" name="returned" value={returned} class="hidden" />
          <Select.Root
            type="single"
            name="pageSize"
            bind:value={returned}
          >
            <Select.Trigger class="col-span-3"> 
              {returned}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Item value={'true'} label={'true'} />
                <Select.Item value={'false'} label={'false'} />
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="reason" class="text-right">Reason</Label>
          <Input id="reason" name="reason" value={updatedReservationUser.reason} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="adminNote" class="text-right">Admin Note</Label>
          <Input id="adminNote" name="adminNote" value={updatedReservationUser.adminNote} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="returnNote" class="text-right">Return Note</Label>
          <Input id="returnNote" name="returnNote" value={updatedReservationUser.returnNote} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="returnDate" class="text-right">Return Date</Label>
          <Input id="returnDate" name="returnDate" value={returnDateString} class="hidden" />
          <DateTimePicker bind:date={returnDate} class="col-span-3 justify-start text-left" disabled={returned == 'false'} />
        </div>
      </div>

      <Dialog.Footer>
        <Button type="submit" disabled={formLoading}>Save changes</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
