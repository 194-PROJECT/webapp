<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import { Button } from "$components/elements/button/index.js";
  import * as DropdownMenu from "$components/elements/dropdown-menu/index.js";
  import type { Equipment } from "$datastores/equipment/equipment.type";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";
  import type { ActionResult } from "@sveltejs/kit";
  import { deserialize } from "$app/forms";
  import EquipmentDialogEdit from "./equipment-dialog-edit.svelte";

  let { equipment = $bindable() }: { equipment: Equipment } = $props();
  let isEditDialogOpen = $state(false);

  async function deleteEquipment() {
    const response = await fetch(`?/deleteEquipment`, {
      method: "POST",
      body: JSON.stringify({ id: equipment.id }),
    });

    const result: ActionResult = deserialize(await response.text());

    switch (result.type) {
      case "success": {
        toast.success(result.data?.message ?? "Equipment deleted successfully.");
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

  const viewEquipment = () => {
    goto(`/admin/equipment/${equipment.id}`);
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
    <DropdownMenu.Item onclick={viewEquipment}>View Equipment</DropdownMenu.Item>
    <DropdownMenu.Item onclick={toggleEditDialog}>Edit equipment</DropdownMenu.Item>
    <DropdownMenu.Item onclick={deleteEquipment}>Delete equipment</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<EquipmentDialogEdit bind:isOpen={isEditDialogOpen} bind:equipment={equipment} />
