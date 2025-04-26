<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$components/elements/button/index.js';
	import * as Dialog from '$components/elements/dialog/index.js';
	import { Input } from '$components/elements/input/index.js';
	import type { Group } from '$datastores/group/group.type';
	import type { Class } from '$datastores/class/class.type';
	import type { ActionResult, SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import type { Semester } from '$datastores/semester/semester.type';
	import type { Course } from '$datastores/course/course.type';
	import Separator from '$components/elements/separator/separator.svelte';
	import Badge from '$components/elements/badge/badge.svelte';
	import X from 'lucide-svelte/icons/x';
	import type { GroupUser } from '$datastores/group-user/group-user.type';

	let {
		isOpen = $bindable(false),
		group = $bindable(),
    additionalData,
	}: {
		isOpen: boolean;
		group: Group;
    additionalData: {
      semesters: Semester[];
      courses: Course[];
      classes: Class[];
    };
	} = $props();

	let updatedGroup = $state(group);
	let formLoading = $state(false);

	const addUserToGroup: SubmitFunction = () => {
		formLoading = true;

		return async ({ result }) => {
			if (result.type === 'success') {
				toast.success('User added to group successfully');
        const data = result.data?.data as GroupUser;
        updatedGroup.users = [...(updatedGroup.users || []), data];
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

  const deleteUserFromGroup: SubmitFunction = async (event) => {
    const idValue = event.formData.get('id');
    const id = idValue ? Number(idValue) : null;
    if (id === null || isNaN(id)) {
      throw new Error('Invalid ID value');
    }

		return async ({ result }) => {
			if (result.type === 'success') {
				toast.success('User removed from group successfully');
        updatedGroup.users = updatedGroup.users?.filter((user) => user.id !== id);
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
		};
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content class="sm:max-w-[50vw]">
		<Dialog.Header>
			<Dialog.Title class="sm:text-3xl">{updatedGroup.name}</Dialog.Title>
			<Dialog.Description>
				Add or delete members from the group.
			</Dialog.Description>
		</Dialog.Header>
    <Separator class="" />
		<div class="flex flex-col gap-4">
      {#if updatedGroup?.users}
        <p class="text-1xl font-bold">Group members:</p>
        <div class="flex flex-wrap gap-4">
          {#each updatedGroup.users as groupUser (groupUser.id)}
              <Badge class="w-fit flex items-center gap-2" variant="outline">
                <a href="/admin/user/{groupUser.userId}">
                  { groupUser.user?.firstName } { groupUser.user?.lastName }
                </a>
                <form method="POST" action="?/deleteUserFromGroup" use:enhance={deleteUserFromGroup}>
                  <Input id="id" name="id" value={groupUser.id} class="hidden" />
                  <Button type="submit" variant="link" class="text-red-500 hover:text-red-700 p-0 m-0">
                    <X />
                  </Button>
              </Badge>
          {/each}
        </div>
      {/if}
    </div>
    <div>
      <p class="text-1xl font-bold mb-4">Add new member: </p>
      <form method="POST" action="?/addUserToGroup" use:enhance={addUserToGroup}>
        <div class="flex flex-col gap-4">
          <Input id="groupId" name="groupId" value={group.id} class="hidden" />
          <Input
            id="userId"
            name="userId"
            type="number"
            placeholder="User ID"
            class="w-full"
            required
          />
          <Button type="submit" disabled={formLoading}>Add User</Button>
        </div>
      </form>
    </div>
	</Dialog.Content>
</Dialog.Root>
