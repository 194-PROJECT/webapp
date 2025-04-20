<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import { Button } from "$components/elements/button/index.js";
  import * as DropdownMenu from "$components/elements/dropdown-menu/index.js";
  import { goto } from "$app/navigation";
  import type { ActionResult } from "@sveltejs/kit";
  import { deserialize } from "$app/forms";
  import { toast } from "svelte-sonner";
  import type { ReservationEquipment } from "$datastores/reservation-equipment/reservation-equipment.type";

  let { reservationEquipment = $bindable() }: { reservationEquipment: ReservationEquipment } = $props();

  const viewReservation = () => {
    goto(`/admin/reservation/${reservationEquipment.reservationId}`);
  };

  const viewUser = () => {
    goto(`/admin/user/${reservationEquipment.reservation?.userId}`);
  };

  const viewEquipment = () => {
    goto(`/admin/equipment/${reservationEquipment.equipmentId}`);
  };

  const sendEmail = () => {
    const email = reservationEquipment.reservation?.user?.email;
    if (email) {
      window.location.href = `mailto:${email}`;
    } else {
      toast.error("No email address found.");
    }
  };

  const toggleMishandleStatus = async () => {
    const response = await fetch(`?/toggleMishandleStatus`, {
      method: "POST",
      body: JSON.stringify({
        id: reservationEquipment.id,
        mishandled: !reservationEquipment.mishandled,
      }),
    });

    const result: ActionResult = deserialize(await response.text());

    switch (result.type) {
      case "success": {
        toast.success(result.data?.message ?? "Mishandle status resolved.");
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
    <DropdownMenu.Item onclick={viewReservation}>View reservation</DropdownMenu.Item>
    <DropdownMenu.Item onclick={viewUser}>View user</DropdownMenu.Item>
    <DropdownMenu.Item onclick={viewEquipment}>View equipment</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item onclick={sendEmail}>Email</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item onclick={toggleMishandleStatus}>Resolve</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
