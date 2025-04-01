<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$components/elements/button';
	import Calendar from '$components/elements/calendar/calendar.svelte';
	import * as Dialog from '$components/elements/dialog';
	import { Input } from '$components/elements/input';
	import { Label } from '$components/elements/label';
	import * as Popover from '$components/elements/popover';
	import type { Equipment } from '$datastores/equipment/equipment.type';
	import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
  import CalendarIcon from "lucide-svelte/icons/calendar";
	import { getDateInput } from '$lib/utils';

	let {
		isOpen = $bindable(false),
		equipment = $bindable()
	}: {
		isOpen: boolean;
		equipment: Equipment;
	} = $props();

	let updatedEquipment = $derived(structuredClone(equipment));
	let formLoading = $state(false);
  let purchaseDate = $state(parseDate(getDateInput(equipment.purchaseDate)));
  let purchaseDateString = $derived(purchaseDate.toString());

  const dateFormatter = new DateFormatter("en-US", {
    dateStyle: "long"
  });

	const submitUpdateEquipment: SubmitFunction = () => {
		formLoading = true;

		return async ({ result }) => {
			if (result.type === 'success') {
				toast.success('Equipment updated successfully');
				goto(location.href, {
					replaceState: true,
					noScroll: true,
					keepFocus: true,
					invalidateAll: true,
				});
				isOpen = false;
			}

			if (result.type === 'failure') {
				const error = result.data?.error;
				if (typeof error === 'string') {
					toast.error(error);
				} else if (Array.isArray(error) && error.length) {
					toast.error(error[0]);
				} else {
					toast.error('An unexpected error occurred.');
				}
			}

			formLoading = false;
		};
	};
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content class="sm:max-w-[50vw]">
		<Dialog.Header>
			<Dialog.Title class="sm:text-3xl">{updatedEquipment.name}</Dialog.Title>
			<Dialog.Description>
				Make changes to the equipment's information. 'Save changes' to apply.
			</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/updateEquipment" use:enhance={submitUpdateEquipment}>
			<div class="grid gap-4 py-4">
				<Input id="id" name="id" value={updatedEquipment.id} class="hidden" />

				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="name" class="text-right">Name</Label>
					<Input id="name" name="name" value={updatedEquipment.name} class="col-span-3" />
				</div>

				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="description" class="text-right">Description</Label>
					<Input id="description" name="description" value={updatedEquipment.description} class="col-span-3" />
				</div>

				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="category" class="text-right">Category</Label>
					<Input id="category" name="category" value={updatedEquipment.category} class="col-span-3" />
				</div>

        <div class="grid grid-cols-4 items-center gap-4">
					<Label for="quantity" class="text-right">Quantity</Label>
					<Input id="quantity" name="quantity" type="number" value={updatedEquipment.quantity} class="col-span-3" />
				</div>

        <div class="grid grid-cols-4 items-center gap-4">
					<Label for="purchasedBy" class="text-right">Purchased By</Label>
					<Input id="purchasedBy" name="purchasedBy" value={updatedEquipment.purchasedBy} class="col-span-3" />
				</div>

				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="purchaseDate" class="text-right">Purchase Date</Label>
          <Input id="purchaseDate" name="purchaseDate" type="date" value={purchaseDateString} class="hidden" />
          <Popover.Root>
            <Popover.Trigger class="col-span-3 justify-start text-left">
              {#snippet child({ props })}
                <Button
                  variant="outline"
                  class="w-[240px] justify-start align-middle text-left font-normal"
                  {...props}
                >
                  <CalendarIcon />
                  {purchaseDate ? dateFormatter.format(purchaseDate.toDate(getLocalTimeZone())) : "Pick a date"}
                </Button>
              {/snippet}
            </Popover.Trigger>
            <Popover.Content class="w-auto p-0" align="start">
              <Calendar type="single" id="purchaseDate" bind:value={purchaseDate} />
            </Popover.Content>
          </Popover.Root>
				</div>

				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="price" class="text-right">Price (₱)</Label>
					<Input id="price" name="price" value={updatedEquipment.price} class="col-span-3" />
				</div>
			</div>

			<Dialog.Footer>
				<Button type="submit" disabled={formLoading}>Save changes</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>