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

  let {
    isOpen = $bindable(false),
    equipmentItem = $bindable()
  }: {
    isOpen: boolean;
    equipmentItem: EquipmentItem;
  } = $props();

  let updatedEquipmentItem = $derived(structuredClone(equipmentItem));
  let formLoading = $state(false);

  const submitUpdateEquipmentItem: SubmitFunction = () => {
    formLoading = true;

    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success('Equipment item updated successfully');
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
      <Dialog.Title class="sm:text-3xl">{updatedEquipmentItem.itemCode}</Dialog.Title>
      <Dialog.Description>
        Make changes to the equipment item's information. 'Save changes' to apply.
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/updateEquipmentItem" use:enhance={submitUpdateEquipmentItem}>
      <div class="grid gap-4 py-4">
        <Input id="id" name="id" value={updatedEquipmentItem.id} class="hidden" />
        <Input id="equipmentId" name="equipmentId" value={updatedEquipmentItem.equipmentId} class="hidden" />

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="itemCode" class="text-right">Item Code</Label>
          <Input id="itemCode" name="itemCode" value={updatedEquipmentItem.itemCode} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="available" class="text-right">Available</Label>
          <div class="col-span-3 flex">
            <Input id="available" name="available" type="checkbox" checked={updatedEquipmentItem.available} class="aspect-square flex-shrink" />
          </div>
        </div>
      </div>

      <Dialog.Footer>
        <Button type="submit" disabled={formLoading}>Save changes</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
