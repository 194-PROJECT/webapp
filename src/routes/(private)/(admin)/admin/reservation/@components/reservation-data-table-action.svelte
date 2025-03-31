<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import { Button } from "$components/elements/button/index.js";
  import * as DropdownMenu from "$components/elements/dropdown-menu/index.js";
  import type { ReservationUser } from "$datastores/reservation/reservation.type";
  import ReservationDialogEdit from "./reservation-dialog-edit.svelte";

  let { reservationUser = $bindable() }: { reservationUser: ReservationUser } = $props();
  let isEditDialogOpen = $state(false);
  let approveDialogOpen = $state(false);

  function toggleEditDialog() {
    isEditDialogOpen = true;
  }

  function toggleApproveDialog() {
    approveDialogOpen = true;
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
    <DropdownMenu.Item onclick={toggleEditDialog}>Edit reservation</DropdownMenu.Item>
    <DropdownMenu.Item onclick={toggleApproveDialog}>Approve reservation</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<ReservationDialogEdit bind:isOpen={isEditDialogOpen} reservationUser={reservationUser} />
