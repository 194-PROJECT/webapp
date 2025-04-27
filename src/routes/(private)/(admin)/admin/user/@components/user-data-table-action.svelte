<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import { Button } from "$components/elements/button/index.js";
  import * as DropdownMenu from "$components/elements/dropdown-menu/index.js";
	import type { User } from "$datastores/user/user.type";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";
	import type { ActionResult } from "@sveltejs/kit";
	import { deserialize } from "$app/forms";
	import UserDialogEdit from "./user-dialog-edit.svelte";
	import * as AlertDialog from "$components/elements/alert-dialog";

  let { user = $bindable() }: { user: User } = $props();
  let isEditDialogOpen = $state(false);
  let isDeleteDialogOpen = $state(false);

  const deleteUser = async () => {
    const response = await fetch(`?/deleteUser`, {
      method: "POST",
      body: JSON.stringify({ id: user.id }),
    });

    const result: ActionResult = deserialize(await response.text());

    switch (result.type) {
      case "success": {
        toast.success(result.data?.message ?? "User deleted successfully.");
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
  };

  const viewUser = () => {
    goto(`/admin/user/${user.id}`);
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
      <DropdownMenu.Item onclick={() => navigator.clipboard.writeText(user.email)}>
        Copy email
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item onclick={viewUser}>View user</DropdownMenu.Item>
    <DropdownMenu.Item onclick={toggleEditDialog}>Edit user</DropdownMenu.Item>
    <DropdownMenu.Item onclick={toggleDeleteDialog}>Delete user</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<UserDialogEdit bind:isOpen={isEditDialogOpen} user={user} />
<AlertDialog.Root bind:open={isDeleteDialogOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete the user and remove their data from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action onclick={deleteUser}>Continue</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
