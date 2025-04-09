<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import { Button } from "$components/elements/button/index.js";
  import * as DropdownMenu from "$components/elements/dropdown-menu/index.js";
  import type { EquipmentItem } from "$datastores/equipment-item/equipment-item.type";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";
  import type { ActionResult } from "@sveltejs/kit";
  import { deserialize } from "$app/forms";
  import EquipmentItemDialogEdit from "./equipment-item-dialog-edit.svelte";

  let { equipmentItem = $bindable() }: { equipmentItem: EquipmentItem } = $props();
  let isEditDialogOpen = $state(false);

  async function deleteEquipmentItem() {
    const response = await fetch(`?/deleteEquipmentItem`, {
      method: "POST",
      body: JSON.stringify({ id: equipmentItem.id }),
    });

    const result: ActionResult = deserialize(await response.text());

    switch (result.type) {
      case "success": {
        toast.success(result.data?.message ?? "Equipment item deleted successfully.");
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
  };

  const toggleEditDialog = () => {
    isEditDialogOpen = true;
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
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item onclick={toggleEditDialog}>Edit Item</DropdownMenu.Item>
    <DropdownMenu.Item onclick={deleteEquipmentItem}>Delete Item</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<EquipmentItemDialogEdit bind:isOpen={isEditDialogOpen} bind:equipmentItem={equipmentItem} />
