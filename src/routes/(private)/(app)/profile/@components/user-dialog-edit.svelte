<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$components/elements/button/index.js';
	import * as Dialog from '$components/elements/dialog/index.js';
	import { Input } from '$components/elements/input/index.js';
	import { Label } from '$components/elements/label/index.js';
	import { userTypeToRoleMap } from '$core/auth/auth.type';
	import type { User } from '$datastores/user/user.type';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';

	let {
		isOpen = $bindable(false),
		user = $bindable()
	}: {
		isOpen: boolean;
		user: User;
	} = $props();

  let updatedUser = $derived(structuredClone(user));
  let formLoading = $state(false);

  let userType = $state(user.type);
  let userRole = $state(user.role);

  $effect(() => {
    userRole = userTypeToRoleMap[userType];
  });

  const submitUpdateUser: SubmitFunction = () => {
    formLoading = true;
    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success('User updated successfully');
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
      <Dialog.Title class="sm:text-3xl">{updatedUser.firstName} {updatedUser.lastName}</Dialog.Title>
      <Dialog.Description>
        Make changes to the user's information. 'Save changes' to apply.
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/updateUser" use:enhance={submitUpdateUser}>
      <div class="grid gap-4 py-4">
        <Input id="id" name="id" value={updatedUser.id} class="hidden" />

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="firstName" class="text-right">First name</Label>
          <Input id="firstName" name="firstName" value={updatedUser.firstName} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="lastName" class="text-right">Last Name</Label>
          <Input id="lastName" name="lastName" value={updatedUser.lastName} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="username" class="text-right">Username</Label>
          <Input id="username" name="username" value={updatedUser.username} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="phoneNumber" class="text-right">Phone</Label>
          <Input id="phoneNumber" name="phoneNumber" value={updatedUser.phoneNumber} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="profilePictureUrl" class="text-right">Profile Picture URL</Label>
          <Input id="profilePictureUrl" name="profilePictureUrl" value={updatedUser.profilePictureUrl} class="col-span-3" />
        </div>
      </div>

      <Dialog.Footer>
        <Button type="submit" disabled={formLoading}>Save changes</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>