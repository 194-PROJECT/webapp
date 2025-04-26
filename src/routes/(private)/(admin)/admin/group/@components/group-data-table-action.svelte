<script lang="ts">
	import Ellipsis from "lucide-svelte/icons/ellipsis";
	import { Button } from "$components/elements/button/index.js";
	import * as DropdownMenu from "$components/elements/dropdown-menu/index.js";
	import type { Group } from "$datastores/group/group.type";
	import type { Class } from "$datastores/class/class.type";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";
	import type { ActionResult } from "@sveltejs/kit";
	import { deserialize } from "$app/forms";
	import GroupDialogEdit from "./group-dialog-edit.svelte";
	import GroupDialogMembers from "./group-dialog-members.svelte";
	import type { Semester } from "$datastores/semester/semester.type";
	import type { User } from "$datastores/user/user.type";
	import type { Course } from "$datastores/course/course.type";

	let {
    data = $bindable(), 
    additionalData = $bindable()
  }: {
    data: {
      group: Group;
      class: Class | undefined;
      semester: Semester | undefined;
      instructor: User | undefined;
    },
    additionalData: {
      semesters: Semester[];
      courses: Course[];
      classes: Class[];
    };
  } = $props();
	let isEditDialogOpen = $state(false);
  let isMembersDialogOpen = $state(false);

	async function deleteGroup() {
		const response = await fetch(`?/deleteGroup`, {
			method: "POST",
			body: JSON.stringify({ id: data.group.id }),
		});

		const result: ActionResult = deserialize(await response.text());

		switch (result.type) {
			case "success": {
				toast.success(result.data?.message ?? "Group deleted successfully.");
				goto(location.href, {
					replaceState: true,
					noScroll: true,
					keepFocus: true,
					invalidateAll: true,
				});
				break;
			}
			case "failure":
				toast.error(result.data?.error ?? "An error occurred.");
				break;
		}
	}

	function toggleEditDialog() {
		isEditDialogOpen = true;
	}

  function toggleMembersDialog() {
    isMembersDialogOpen = true;
  }
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				size="icon"
				class="relative size-8 p-0"
			>
				<span class="sr-only">Open menu</span>
				<Ellipsis />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
			<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(data.group.name)}>
				Copy name
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={toggleEditDialog}>Edit group</DropdownMenu.Item>
		<DropdownMenu.Item onclick={deleteGroup}>Delete group</DropdownMenu.Item>
		<DropdownMenu.Separator />
    <DropdownMenu.Item onclick={toggleMembersDialog}>Edit members</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<GroupDialogEdit bind:isOpen={isEditDialogOpen} group={data.group} additionalData={additionalData} />
<GroupDialogMembers bind:isOpen={isMembersDialogOpen} group={data.group} additionalData={additionalData} />