<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$components/elements/button/index.js';
  import * as Dialog from '$components/elements/dialog/index.js';
  import { Input } from '$components/elements/input/index.js';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { toast } from 'svelte-sonner';
  import Separator from '$components/elements/separator/separator.svelte';
  import Badge from '$components/elements/badge/badge.svelte';
  import X from 'lucide-svelte/icons/x';
  import type { Equipment } from '$datastores/equipment/equipment.type';
  import type { EquipmentImage } from '$datastores/equipment-image/equipment-image.type';

  let {
    isOpen = $bindable(false),
    equipment = $bindable(),
    images = $bindable([]),
  }: {
    isOpen: boolean;
    equipment: Equipment;
    images: EquipmentImage[];
  } = $props();

  let formLoading = $state(false);

  const addEquipmentImage: SubmitFunction = () => {
    formLoading = true;

    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success('Image added to equipment successfully');
        const data = result.data?.data as EquipmentImage;
        images = [...images, data];
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

  const deleteEquipmentImage: SubmitFunction = async (event) => {
    const idValue = event.formData.get('id');
    const id = idValue ? Number(idValue) : null;
    if (id === null || isNaN(id)) {
      throw new Error('Invalid ID value');
    }

    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success('Image removed from equipment successfully');
        images = images.filter((image) => image.id !== id);
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
    };
  };
</script>

<Dialog.Root bind:open={isOpen}>
  <Dialog.Content class="sm:max-w-[50vw]">
    <Dialog.Header>
      <Dialog.Title class="sm:text-3xl">{equipment.name}</Dialog.Title>
      <Dialog.Description>
        Manage images associated with this equipment.
      </Dialog.Description>
    </Dialog.Header>
  <Separator class="" />
    <div class="flex flex-col gap-4">
    <p class="text-1xl font-bold">Equipment Images:</p>
    <div class="flex flex-wrap items-center gap-4">
    {#each images as image (image.id)}
      <img src="{image.imageUrl}" alt="{`Image of ${equipment.name}`}" class="h-20 w-20 object-cover rounded" />
      <form method="POST" action="?/deleteEquipmentImage" use:enhance={deleteEquipmentImage}>
        <Input id="id" name="id" value={image.id} class="hidden" />
        <Button type="submit" variant="link" class="text-red-500 hover:text-red-700 p-0 m-0">
        <X />
        </Button>
      </form>
    {/each}
    </div>
  </div>
  <div>
    <p class="text-1xl font-bold mb-4">Add a new image: </p>
    <form method="POST" action="?/addEquipmentImage" use:enhance={addEquipmentImage}>
      <div class="flex flex-col gap-4">
        <Input id="equipmentId" name="equipmentId" value={equipment.id} class="hidden" />
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="Image URL"
          class="w-full"
          required
        />
        <Button type="submit" disabled={formLoading}>Add Image</Button>
      </div>
    </form>
  </div>
  </Dialog.Content>
</Dialog.Root>
