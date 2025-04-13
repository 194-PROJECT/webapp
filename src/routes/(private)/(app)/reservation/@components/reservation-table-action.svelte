<script lang="ts">
	import { deserialize } from "$app/forms";
	import { goto } from "$app/navigation";
	import Button from "$components/elements/button/button.svelte";
	import * as DropdownMenu from "$components/elements/dropdown-menu";
	import { getReservationStatus, isReservationFinished, isReservationOngoing, isReservationPending } from "$datastores/reservation/reservation.helper.svelte";
	import type { Reservation } from "$datastores/reservation/reservation.type";
	import type { ActionResult } from "@sveltejs/kit";
	import Ellipsis from "lucide-svelte/icons/ellipsis";
	import { toast } from "svelte-sonner";

  let { reservation }: { reservation: Reservation } = $props();

  const viewReservation = () => {
    goto(`/reservation/${reservation.id}`);
  };

  const cancelReservation = async () => {
		const response = await fetch(`?/deleteReservation`, {
			method: "POST",
			body: JSON.stringify({ id: reservation.id }),
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
		<DropdownMenu.Item onclick={viewReservation}>view</DropdownMenu.Item>
		<DropdownMenu.Item onclick={cancelReservation} disabled={
      !isReservationPending(reservation)
    }>cancel</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>