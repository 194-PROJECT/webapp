<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import { Button } from "$components/elements/button/index.js";
  import * as DropdownMenu from "$components/elements/dropdown-menu/index.js";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";
  import type { ActionResult } from "@sveltejs/kit";
  import { deserialize } from "$app/forms";
  import SemesterDialogEdit from "./semester-dialog-edit.svelte";
  import type { Semester } from "$datastores/semester/semester.type";

  let {
    data = $bindable(),
    additionalData = $bindable()
  }: {
    data: {
      semester: Semester;
    },
    additionalData: {};
  } = $props();
  let isEditDialogOpen = $state(false);

  async function deleteSemester() {
    const response = await fetch(`?/deleteSemester`, {
      method: "POST",
      body: JSON.stringify({ id: data.semester.id }),
    });

    const result: ActionResult = deserialize(await response.text());

    switch (result.type) {
      case "success": {
        toast.success(result.data?.message ?? "Semester deleted successfully.");
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
      <DropdownMenu.Item onclick={() => navigator.clipboard.writeText(data.semester.name)}>
        Copy name
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item onclick={toggleEditDialog}>Edit semester</DropdownMenu.Item>
    <DropdownMenu.Item onclick={deleteSemester}>Delete semester</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<SemesterDialogEdit bind:isOpen={isEditDialogOpen} semester={data.semester} additionalData={additionalData} />