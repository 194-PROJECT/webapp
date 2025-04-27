<script lang="ts">
	import Ellipsis from "lucide-svelte/icons/ellipsis";
	import { Button } from "$components/elements/button/index.js";
	import * as DropdownMenu from "$components/elements/dropdown-menu/index.js";
	import type { Class } from "$datastores/class/class.type";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";
	import type { ActionResult } from "@sveltejs/kit";
	import { deserialize } from "$app/forms";
	import ClassDialogEdit from "./class-dialog-edit.svelte";
	import type { Semester } from "$datastores/semester/semester.type";
	import type { User } from "$datastores/user/user.type";
	import type { Course } from "$datastores/course/course.type";
	import * as AlertDialog from "$components/elements/alert-dialog";

	let {
    data = $bindable(), 
    additionalData = $bindable()
  }: {
    data: {
      class: Class;
      semester: Semester | undefined;
      instructor: User | undefined;
    },
    additionalData: {
      semesters: Semester[];
      instructors: User[];
      courses: Course[];
    };
  } = $props();
	let isEditDialogOpen = $state(false);
	let isDeleteDialogOpen = $state(false);

	async function deleteClass() {
		const response = await fetch(`?/deleteClass`, {
			method: "POST",
			body: JSON.stringify({ id: data.class.id }),
		});

		const result: ActionResult = deserialize(await response.text());

		switch (result.type) {
			case "success": {
				toast.success(result.data?.message ?? "Class deleted successfully.");
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
		        
		toggleDeleteDialog();
	}

	const toggleEditDialog = () => {
    isEditDialogOpen = !isEditDialogOpen;
  }

  const toggleDeleteDialog = () => {
    isDeleteDialogOpen = !isDeleteDialogOpen;
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
			<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(data.class.name)}>
				Copy name
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={toggleEditDialog}>Edit class</DropdownMenu.Item>
		<DropdownMenu.Item onclick={toggleDeleteDialog}>Delete class</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<ClassDialogEdit bind:isOpen={isEditDialogOpen} classItem={data.class} additionalData={additionalData} />
<AlertDialog.Root bind:open={isDeleteDialogOpen}>
	<AlertDialog.Content>
	  <AlertDialog.Header>
		<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
		<AlertDialog.Description>
		  This action cannot be undone. This will permanently delete the class and remove its data from our servers.
		</AlertDialog.Description>
	  </AlertDialog.Header>
	  <AlertDialog.Footer>
		<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
		<AlertDialog.Action onclick={deleteClass}>Continue</AlertDialog.Action>
	  </AlertDialog.Footer>
	</AlertDialog.Content>
  </AlertDialog.Root>
  