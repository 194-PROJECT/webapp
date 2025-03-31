<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$components/elements/button/index.js';
	import * as Dialog from '$components/elements/dialog/index.js';
	import { Input } from '$components/elements/input/index.js';
	import { Label } from '$components/elements/label/index.js';
	import type { ReservationUser } from '$datastores/reservation/reservation.type';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';

	let {
		isOpen = $bindable(false),
		reservationUser = $bindable()
	}: {
		isOpen: boolean;
		reservationUser: ReservationUser;
	} = $props();

  let updatedReservationUser = $derived(structuredClone(reservationUser));
  let formLoading = $state(false);

  const submitUpdateStudent: SubmitFunction = () => {
    formLoading = true;

    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success('Student updated successfully');
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
      <Dialog.Title class="sm:text-3xl">{updatedReservationUser.firstName} {updatedReservationUser.lastName}</Dialog.Title>
      <Dialog.Description>
        Make changes to the student's information. 'Save changes' to apply.
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/updateStudent" use:enhance={submitUpdateStudent}>
      <div class="grid gap-4 py-4">
        <Input id="id" name="id" value={updatedReservationUser.id} class="hidden" />

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="startDate" class="text-right">Start Date</Label>
          <Input id="startDate" name="startDate" value={updatedReservationUser.startDate} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="endDate" class="text-right">End Date</Label>
          <Input id="endDate" name="endDate" value={updatedReservationUser.endDate} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="accepted" class="text-right">Accepted</Label>
          <Input id="accepted" name="accepted" value={updatedReservationUser.accepted} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="returned" class="text-right">Returned</Label>
          <Input id="returned" name="returned" value={updatedReservationUser.returned} class="col-span-3" />
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
          <Label for="returnDate" class="text-right">Return Note</Label>
          <Input id="returnDate" name="returnDate" value={updatedReservationUser.returnDate} class="col-span-3" />
        </div>
      </div>

      <Dialog.Footer>
        <Button type="submit" disabled={formLoading}>Save changes</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
