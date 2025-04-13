<script lang="ts">
	import * as Card from '$components/elements/card';
	import Input from '$components/elements/input/input.svelte';
	import Separator from '$components/elements/separator/separator.svelte';
	import Toggle from '$components/elements/toggle/toggle.svelte';
	import type { Equipment } from '$datastores/equipment/equipment.type';
	import { cn } from '$lib/utils';

  let {
    equipments = $bindable(),
  }: {
    equipments: (Equipment & {
      searchTerm: string,
      selected: boolean,
      amount: number,
    })[];
  } = $props();

  let searchTerm = $state('');
</script>

<div class="flex mb-4">
  <Input
    type="text"
    placeholder="Search for equipment..."
    class="ml-auto w-auto"
    bind:value={searchTerm}
  />
</div>
<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
  {#each equipments as equipment (equipment)}
    {#if equipment.searchTerm.toLowerCase().includes(searchTerm)}
      <Card.Root class={cn(equipment.selected ? 'border-green-700' : '')}>
        <Card.Content class="h-full flex flex-col">
          <img src={equipment.images ? equipment.images[0].imageUrl : ''} alt={equipment.name} class="w-full h-[10rem] object-cover rounded-lg mb-4" />
            <Card.Title class="text-2xl font-bold flex items-center">
              <p class="flex-grow">{equipment.name}</p>
              <p class="text-sm h-auto">available: {equipment.items?.length}</p>
            </Card.Title>
          <Separator class="my-4" />
          <div class="flex flex-col flex-grow">
            <p class="text-1xl flex-grow"><span class="font-bold">Description:</span> {equipment.description}</p>
            <div class="flex items-center mt-4">
              <Input
                type="number"
                class="mr-4"
                placeholder="Quantity"
                bind:value={equipment.amount}
                onchange={() => {
                  equipment.amount = Math.min(equipment.items?.length ?? 1, equipment.amount);
                }}
              />
              <Toggle
                class="border"
                onclick={() => {
                  equipment.selected = !equipment.selected;
                }}
              >
                Reserve
              </Toggle>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    {/if}
  {/each}
</div>
