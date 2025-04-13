<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { Button } from '$components/elements/button';
  import * as Dialog from '$components/elements/dialog';
  import { Input } from '$components/elements/input';
  import { Label } from '$components/elements/label';
	import type { EquipmentItem } from '$datastores/equipment-item/equipment-item.type';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { toast } from 'svelte-sonner';
  import { v4 as uuidv4 } from 'uuid';

  let {
    isOpen = $bindable(false),
    equipmentId = $bindable(),
  }: {
    isOpen: boolean;
    equipmentId: number;
  } = $props();

  let initialEquipmentItem: Partial<EquipmentItem> = {
    itemCode: uuidv4(),
    equipmentId: equipmentId,
    available: true,
  };

  let equipmentItem = $state(structuredClone(initialEquipmentItem));
  let formLoading = $state(false);

  const submitCreateEquipmentItem: SubmitFunction = () => {
    formLoading = true;
    return async ({ result, update }) => {
      await update();

      if (result.type === 'success') {
        toast.success('Equipment item created successfully');
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
      <Dialog.Title class="sm:text-3xl">Create Equipment Item</Dialog.Title>
      <Dialog.Description>
        Fill out the form below to create a new equipment item record. Ensure all required fields are completed accurately.
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/createEquipmentItem" use:enhance={submitCreateEquipmentItem}>
      <Input id="equipmentId" name="equipmentId" type="number" value={equipmentItem.equipmentId} class="hidden" />

      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="itemCode" class="text-right">Item Code</Label>
          <Input id="itemCode" name="itemCode" value={equipmentItem.itemCode} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="available" class="text-right">Available</Label>
          <Input id="available" name="available" type="checkbox" checked={equipmentItem.available} class="col-span-3" />
        </div>
      </div>

      <Dialog.Footer>
        <Button type="submit" disabled={formLoading}>Create equipment item</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
