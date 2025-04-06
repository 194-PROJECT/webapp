<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { Button } from '$components/elements/button/index.js';
  import * as Dialog from '$components/elements/dialog/index.js';
  import { Input } from '$components/elements/input/index.js';
  import { Label } from '$components/elements/label/index.js';
  import type { Course } from '$datastores/course/course.type';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { toast } from 'svelte-sonner';
  import * as Select from '$components/elements/select';
  import type { Program } from '$datastores/program/program.type';

  let {
    isOpen = $bindable(false),
    additionalData = $bindable(),
  }: {
    isOpen: boolean;
    additionalData: {
      programs: Program[];
    };
  } = $props();

  let initialCourse = {
    name: '',
    description: '',
  } as Partial<Course>;

  let courseItem = $state(structuredClone(initialCourse));
  let formLoading = $state(false);

  let programId = $state((courseItem.programId ?? '').toString());

  let programOptions = $derived.by(() => {
    return additionalData.programs.map((program) => ({
      value: program.id.toString(),
      label: program.title,
    }));
  });

  let programTriggerContent = $derived(programOptions.find((f) => f.value === programId)?.label ?? 'Select a program');

  const submitCreateCourse: SubmitFunction = () => {
    formLoading = true;
    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success('Course created successfully');
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
      <Dialog.Title class="sm:text-3xl">Create Course</Dialog.Title>
      <Dialog.Description>
        Fill out the form below to create a new course. Ensure all required fields are completed accurately.
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/createCourse" use:enhance={submitCreateCourse}>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="programId" class="text-right">Program</Label>
          <Input id="programId" name="programId" bind:value={programId} class="hidden" />
          <Select.Root
            type="single"
            name="programId"
            bind:value={programId}
          >
            <Select.Trigger class="col-span-3">
              {programTriggerContent}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.GroupHeading>Programs</Select.GroupHeading>
                {#each programOptions as programOption (programOption.value)}
                  <Select.Item value={programOption.value} label={programOption.label} />
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Course Name</Label>
          <Input id="name" name="name" value={courseItem.name} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="description" class="text-right">Description</Label>
          <Input id="description" name="description" value={courseItem.description} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="credits" class="text-right">Credits</Label>
          <Input id="credits" name="credits" type="number" value={courseItem.credits} class="col-span-3" />
        </div>
      </div>

      <Dialog.Footer>
        <Button type="submit" disabled={formLoading}>Create course</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
