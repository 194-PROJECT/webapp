<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$components/elements/button/index.js';
	import * as Dialog from '$components/elements/dialog/index.js';
	import { Input } from '$components/elements/input/index.js';
	import { Label } from '$components/elements/label/index.js';
	import * as Select from '$components/elements/select';
	import { UserRole, UserType } from '$core/auth/auth.type';
	import type { User } from '$datastores/user/user.type';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';

	let {
		isOpen = $bindable(false),
	}: {
		isOpen: boolean;
	} = $props();

  let initialUser = {
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    type: undefined,
    role: undefined,
  } as Partial<User>;

  let user = $state(structuredClone(initialUser));

  const submitCreateUser: SubmitFunction = () => {
    return async ({ result, update }) => {
      if (result.type === 'success') {
        toast.success('User created successfully');
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
    }
  }
</script>

<Dialog.Root bind:open={isOpen}>
  <Dialog.Content class="sm:max-w-[50vw]">
    <Dialog.Header>
      <Dialog.Title class="sm:text-3xl">Create User</Dialog.Title>
      <Dialog.Description>
        Fill out the form below to create a new user. Ensure all required fields are completed accurately.
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/createUser" use:enhance={submitCreateUser}>
      <div class="grid gap-4 py-4">
        <Input id="id" name="id" value={user.id} class="hidden" />

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="firstName" class="text-right">First name</Label>
          <Input id="firstName" name="firstName" value={user.firstName} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="lastName" class="text-right">Last Name</Label>
          <Input id="lastName" name="lastName" value={user.lastName} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="username" class="text-right">Username</Label>
          <Input id="username" name="username" value={user.username} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="email" class="text-right">Email</Label>
          <Input id="email" name="email" value={user.email} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="type" class="text-right">Type</Label>
          <Select.Root type="single" name="type" bind:value={user.type}>
            <Select.Trigger class="col-span-1">{user.type}</Select.Trigger>
            <Select.Content>
              <Select.Group>
                {#each Object.values(UserType) as type}
                  <Select.Item value={String(type)} label={type} />
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>

          <div class="col-span-2 flex">
            <Label for="role" class="mr-4 self-center">Role</Label>
            <Select.Root type="single" name="role" bind:value={user.role}>
              <Select.Trigger>{user.role}</Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {#each Object.values(UserRole) as role}
                    <Select.Item value={String(role)} label={role} />
                  {/each}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="password" class="text-right">Password</Label>
          <Input id="password" name="password" value="" class="col-span-3" />
        </div>
      </div>

      <Dialog.Footer>
        <Button type="submit">Create user</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>