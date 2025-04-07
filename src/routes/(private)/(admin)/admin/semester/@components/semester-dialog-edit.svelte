<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { Button } from '$components/elements/button/index.js';
  import * as Dialog from '$components/elements/dialog/index.js';
  import { Input } from '$components/elements/input/index.js';
  import { Label } from '$components/elements/label/index.js';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { toast } from 'svelte-sonner';
  import * as Select from '$components/elements/select';
  import type { Semester } from '$datastores/semester/semester.type';
	import DateTimePicker from '$components/elements/time-picker/date-time-picker.svelte';
	import { getDateInput } from '$lib/utils';
	import { parseDateTime } from '@internationalized/date';

  let {
    isOpen = $bindable(false),
    semester = $bindable(),
    additionalData,
  }: {
    isOpen: boolean;
    semester: Semester;
    additionalData: {};
  } = $props();

  let updatedSemester = $derived(structuredClone(semester));
  let formLoading = $state(false);

  let startDate = $state(parseDateTime(getDateInput(semester.startDate)));
  let startDateString = $derived(startDate.toString());
  let endDate = $state(parseDateTime(getDateInput(semester.endDate)));
  let endDateString = $derived(endDate.toString());

  const submitUpdateSemester: SubmitFunction = () => {
    formLoading = true;

    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success('Semester updated successfully');
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
      <Dialog.Title class="sm:text-3xl">{updatedSemester.name}</Dialog.Title>
      <Dialog.Description>
        Make changes to the semester's information. 'Save changes' to apply.
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/updateSemester" use:enhance={submitUpdateSemester}>
      <div class="grid gap-4 py-4">
        <Input id="id" name="id" value={updatedSemester.id} class="hidden" />

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input id="name" name="name" value={updatedSemester.name} class="col-span-3" />
        </div>

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
      </div>

      <Dialog.Footer>
        <Button type="submit" disabled={formLoading}>Save changes</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
