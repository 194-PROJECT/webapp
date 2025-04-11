<script lang="ts">
	import * as Card from '$components/elements/card';
	import Separator from '$components/elements/separator/separator.svelte';

  let { data } = $props();
  let { equipments } = $derived(data);

  $inspect(equipments[0].images)
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
  {#each equipments as equipment (equipment)}
    <Card.Root>
      <Card.Content>
        <img src={equipment.images ? equipment.images[0].imageUrl : ''} alt={equipment.name} class="w-full h-32 object-cover rounded-lg mb-4" />
        <Card.Title class="text-2xl font-bold mb-4">{equipment.name}</Card.Title>
        <Separator class="my-4" />
        <p class="text-1xl"><span class="font-bold">Description:</span> {equipment.description}</p>
      </Card.Content>
    </Card.Root>
  {/each}
</div>