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
    goto(`/reservation/${reservationEquipment.reservationId}`);
  };

  const viewEquipment = () => {
    goto(`/equipment/${reservationEquipment.equipmentId}`);
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
    <DropdownMenu.Item onclick={viewEquipment}>View equipment</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
