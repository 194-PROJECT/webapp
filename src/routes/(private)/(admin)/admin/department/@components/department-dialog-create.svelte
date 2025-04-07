<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { Button } from '$components/elements/button/index.js';
  import * as Dialog from '$components/elements/dialog/index.js';
  import { Input } from '$components/elements/input/index.js';
  import { Label } from '$components/elements/label/index.js';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { toast } from 'svelte-sonner';
  import type { Department } from '$datastores/department/department.type';

  let {
    isOpen = $bindable(false),
    additionalData = $bindable(),
  }: {
    isOpen: boolean;
    additionalData: {};
  } = $props();

  let initialDepartment = {
    name: '',
    description: '',
  } as Partial<Department>;

  let department = $state(structuredClone(initialDepartment));
  let formLoading = $state(false);

  const submitCreateDepartment: SubmitFunction = () => {
    formLoading = true;
    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success('Department created successfully');
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
      <Dialog.Title class="sm:text-3xl">Create Department</Dialog.Title>
      <Dialog.Description>
        Fill out the form below to create a new department. Ensure all required fields are completed accurately.
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/createDepartment" use:enhance={submitCreateDepartment}>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input id="name" name="name" bind:value={department.name} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="description" class="text-right">Description</Label>
          <Input id="description" name="description" bind:value={department.description} class="col-span-3" />
        </div>
      </div>

      <Dialog.Footer>
        <Button type="submit" disabled={formLoading}>Create Department</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
