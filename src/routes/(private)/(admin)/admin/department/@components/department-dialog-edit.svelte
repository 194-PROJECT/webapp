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

  let {
    isOpen = $bindable(false),
    department = $bindable(),
    additionalData,
  }: {
    isOpen: boolean;
    department: Department;
    additionalData: {};
  } = $props();

  let updatedDepartment = $derived(structuredClone(department));
  let formLoading = $state(false);

  const submitUpdateDepartment: SubmitFunction = () => {
    formLoading = true;

    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success('Department updated successfully');
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
      <Dialog.Title class="sm:text-3xl">{updatedDepartment.name}</Dialog.Title>
      <Dialog.Description>
        Make changes to the department's information. 'Save changes' to apply.
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/updateDepartment" use:enhance={submitUpdateDepartment}>
      <div class="grid gap-4 py-4">
        <Input id="id" name="id" value={updatedDepartment.id} class="hidden" />

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input id="name" name="name" value={updatedDepartment.name} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="description" class="text-right">Description</Label>
          <Input id="description" name="description" value={updatedDepartment.description} class="col-span-3" />
        </div>
      </div>

      <Dialog.Footer>
        <Button type="submit" disabled={formLoading}>Save changes</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
