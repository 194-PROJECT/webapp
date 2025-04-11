<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import { Button } from "$components/elements/button/index.js";
  import * as DropdownMenu from "$components/elements/dropdown-menu/index.js";
	import { goto } from "$app/navigation";
	import type { ReservationEquipment } from "$datastores/reservation-equipment/reservation-equipment.type";
	import type { EquipmentItem } from "$datastores/equipment-item/equipment-item.type";
	import type { EquipmentImage } from "$datastores/equipment-image/equipment-image.type";
	import type { Equipment } from "$datastores/equipment/equipment.type";
	import type { Reservation } from "$datastores/reservation/reservation.type";

  let {
    reservation = $bindable(),
    reservationEquipment = $bindable(),
  }: {
    reservation: Reservation;
    reservationEquipment: {
      reservationEquipment: ReservationEquipment;
      equipmentItem: EquipmentItem | undefined;
      equipment: Equipment | undefined;
      equipmentImage: EquipmentImage | undefined;
    },
    additionalData: {
      equipments: Equipment[];
    };
  } = $props();

  const viewEquipment = () => {
    goto(`/equipment/${reservationEquipment.equipment?.id}`);
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
    <DropdownMenu.Item onclick={viewEquipment}>View</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
