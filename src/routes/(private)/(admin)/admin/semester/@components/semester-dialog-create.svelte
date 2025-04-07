<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { Button } from '$components/elements/button/index.js';
  import * as Dialog from '$components/elements/dialog/index.js';
  import { Input } from '$components/elements/input/index.js';
  import { Label } from '$components/elements/label/index.js';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { toast } from 'svelte-sonner';
  import type { Semester } from '$datastores/semester/semester.type';
	import DateTimePicker from '$components/elements/time-picker/date-time-picker.svelte';
	import { now, parseDateTime } from '@internationalized/date';
	import { getDateInput } from '$lib/utils';

  let {
    isOpen = $bindable(false),
    additionalData = $bindable(),
  }: {
    isOpen: boolean;
    additionalData: {};
  } = $props();

  let initialSemester = {
    name: '',
  } as Partial<Semester>;

  let semester = $state(structuredClone(initialSemester));
  let formLoading = $state(false);

  let startDate = $state(parseDateTime(getDateInput(new Date())));
  let startDateString = $derived(startDate.toString());
  let endDate = $state(parseDateTime(getDateInput(new Date())));
  let endDateString = $derived(startDate.toString());

  const submitCreateSemester: SubmitFunction = () => {
    formLoading = true;
    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success('Semester created successfully');
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
      <Dialog.Title class="sm:text-3xl">Create Semester</Dialog.Title>
      <Dialog.Description>
        Fill out the form below to create a new semester. Ensure all required fields are completed accurately.
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/createSemester" use:enhance={submitCreateSemester}>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input id="name" name="name" bind:value={semester.name} class="col-span-3" />
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
        <Button type="submit" disabled={formLoading}>Create Semester</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
