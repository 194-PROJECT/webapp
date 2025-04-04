<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { Button } from '$components/elements/button/index.js';
  import * as Dialog from '$components/elements/dialog/index.js';
  import { Input } from '$components/elements/input/index.js';
  import { Label } from '$components/elements/label/index.js';
  import type { Group } from '$datastores/group/group.type';
  import type { Class } from '$datastores/class/class.type';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { toast } from 'svelte-sonner';

  let {
    isOpen = $bindable(false),
  }: {
    isOpen: boolean;
  } = $props();

  let initialGroup = {
    classId: undefined,
    name: '',
    description: '',
  } as Partial<Group & Class>;

  let group = $state(structuredClone(initialGroup));
  let formLoading = $state(false);

  const submitCreateGroup: SubmitFunction = () => {
    formLoading = true;
    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success('Group created successfully');
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
      <Dialog.Title class="sm:text-3xl">Create Group</Dialog.Title>
      <Dialog.Description>
        Fill out the form below to create a new group. Ensure all required fields are completed accurately.
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/createGroup" use:enhance={submitCreateGroup}>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="classId" class="text-right">Class ID</Label>
          <Input id="classId" name="classId" value={group.classId} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input id="name" name="name" value={group.name} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="description" class="text-right">Description</Label>
          <Input id="description" name="description" value={group.description} class="col-span-3" />
        </div>
      </div>

      <Dialog.Footer>
        <Button type="submit" disabled={formLoading}>Create group</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>