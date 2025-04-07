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
	import type { Department } from '$datastores/department/department.type';
	import type { Program } from '$datastores/program/program.type';

  let {
    isOpen = $bindable(false),
    additionalData = $bindable(),
  }: {
    isOpen: boolean;
    additionalData: {
      departments: Department[];
    };
  } = $props();

  let initialProgram = {
    title: '',
    description: '',
  } as Partial<Program>;

  let program = $state(structuredClone(initialProgram));
  let formLoading = $state(false);

  let departmentId = $state((program.departmentId ?? 1).toString());

  let departmentOptions = $derived.by(() => {
    return additionalData.departments.map((department) => ({
      value: department.id.toString(),
      label: department.name,
    }));
  });

  let departmentTriggerContent = $derived(departmentOptions.find((f) => f.value === departmentId)?.label ?? 'Department name');

  const submitCreateProgram: SubmitFunction = () => {
    formLoading = true;
    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success('Program created successfully');
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
      <Dialog.Title class="sm:text-3xl">Create Program</Dialog.Title>
      <Dialog.Description>
        Fill out the form below to create a new program. Ensure all required fields are completed accurately.
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/createProgram" use:enhance={submitCreateProgram}>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="departmentId" class="text-right">Department</Label>
          <Input id="departmentId" name="departmentId" bind:value={departmentId} class="hidden" />
          <Select.Root
            type="single"
            name="departmentId"
            bind:value={departmentId}
          >
            <Select.Trigger class="col-span-3">
              {departmentTriggerContent}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.GroupHeading>Departments</Select.GroupHeading>
                {#each departmentOptions as departmentOption (departmentOption.value)}
                  <Select.Item value={departmentOption.value} label={departmentOption.label} />
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="title" class="text-right">Title</Label>
          <Input id="title" name="title" bind:value={program.title} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="description" class="text-right">Description</Label>
          <Input id="description" name="description" bind:value={program.description} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="creditsRequired" class="text-right">Credits Required</Label>
          <Input id="creditsRequired" name="creditsRequired" type="number" step="0.01" bind:value={program.creditsRequired} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="duration" class="text-right">Program Duration (in years)</Label>
          <Input id="duration" name="duration" type="number" step="0.01" bind:value={program.duration} class="col-span-3" />
        </div>
      </div>

      <Dialog.Footer>
        <Button type="submit" disabled={formLoading}>Create Program</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
