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
		group = $bindable()
	}: {
		isOpen: boolean;
		group: Group;
	} = $props();

	let updatedGroup = $derived(structuredClone(group));
	let formLoading = $state(false);

	const submitUpdateGroup: SubmitFunction = () => {
		formLoading = true;

		return async ({ result }) => {
			if (result.type === 'success') {
				toast.success('Group updated successfully');
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
			<Dialog.Title class="sm:text-3xl">{updatedGroup.name}</Dialog.Title>
			<Dialog.Description>
				Make changes to the group's information. 'Save changes' to apply.
			</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/updateGroup" use:enhance={submitUpdateGroup}>
			<div class="grid gap-4 py-4">
				<Input id="id" name="id" value={updatedGroup.id} class="hidden" />

				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="classId" class="text-right">Class ID</Label>
					<Input id="classId" name="classId" value={updatedGroup.classId} class="col-span-3" />
				</div>

				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="name" class="text-right">Name</Label>
					<Input id="name" name="name" value={updatedGroup.name} class="col-span-3" />
				</div>

				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="description" class="text-right">Description</Label>
					<Input id="description" name="description" value={updatedGroup.description} class="col-span-3" />
				</div>
			</div>

			<Dialog.Footer>
				<Button type="submit" disabled={formLoading}>Save changes</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>