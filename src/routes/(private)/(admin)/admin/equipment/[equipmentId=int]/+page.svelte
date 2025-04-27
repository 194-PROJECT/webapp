<script lang="ts">
	import Button from '$components/elements/button/button.svelte';
import * as Card from '$components/elements/card';
	import * as Carousel from '$components/elements/carousel';
	import type { CarouselAPI } from '$components/elements/carousel/context.js';
	import Separator from '$components/elements/separator/separator.svelte';
	import EquipmentImageDialog from './@components/equipment-image-dialog.svelte';
	import EquipmentItemTable from './@components/equipment-item-table.svelte';
	import EquipmentReservationTable from './@components/equipment-reservation-table.svelte';

	let { data } = $props();
	let {
    equipment,
    equipmentItems,
    reservations,
    users
  } = $derived(data);
  let {
    images,
  } = $state(data);

  let equipmentImageDialogOpen = $state(false);

	let api = $state<CarouselAPI>();

	const imageCount = $derived.by(() => images.length);

	let currentImageIndex = $state(0);

  let latestReservationId = $derived.by(() => {
    return reservations
      .slice()
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0]?.id ?? 0;
  });

	$effect(() => {
		if (api) {
			currentImageIndex = api.selectedScrollSnap() + 1;
			api.on('select', () => {
				currentImageIndex = api!.selectedScrollSnap() + 1;
			});
		}
	});

  const toggleEquipmentImageDialog = () => {
    equipmentImageDialogOpen = !equipmentImageDialogOpen;
  };
</script>

<div class="grid gap-4 md:grid-cols-1 lg:grid-cols-4 mb-4">
	<Card.Root>
		<Card.Content>
			<Card.Title class="text-2xl font-bold">{equipment.name}</Card.Title>
			<p class="text-1xl">{equipment.category}</p>
      <Separator class="my-4" />
			<p class="text-muted-foreground">{equipment.description}</p>
      <Separator class="my-4" />
      <p class="text-muted-foreground text-right">Equipment no. {equipment.id}</p>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Content>
			<Card.Title class="text-2xl font-medium">Purchase Details</Card.Title>
			<p class="text-1xl">{equipment.purchaseDate.toLocaleString()}</p>
      <Separator class="my-4" />
			<div class="grid grid-cols-2">
				<p class="text-1xl">Purchased by:</p>
				<p class="text-1xl">{equipment.purchasedBy ?? 'Not assigned'}</p>
			</div>
			<div class="grid grid-cols-2">
				<p class="text-1xl">Price:</p>
				<p class="text-1xl">{equipment.price} PHP</p>
			</div>
			<div class="grid grid-cols-2">
				<p class="text-1xl">Quantity:</p>
				<p class="text-1xl">{equipmentItems.length}</p>
			</div>
      <Separator class="my-4" />
      <Button variant="link" class="text-sm p-0 h-auto" href={`/admin/reservation/${latestReservationId}`}>View Latest Reservation</Button>
		</Card.Content>
	</Card.Root>
	<Card.Root class="md:col-span-1 lg:col-span-2">
		<Card.Content>
      <div class="flex items-center justify-between pb-8">
        <Card.Title class="text-2xl font-medium">Images</Card.Title>
        <Button variant="link" class="text-sm p-0 h-auto" onclick={toggleEquipmentImageDialog}>
          Manage Images
        </Button>
      </div>
			<div class="px-12">
				<Carousel.Root
					opts={{
						align: 'center',
            loop: true,
					}}
					setApi={(emblaApi) => (api = emblaApi)}
				>
					<Carousel.Content class="h-full w-full">
						{#each images as image, i (i)}
							<Carousel.Item class="md:basis-1/2 lg:basis-1/5">
								<div>
									<img
                    src={image.imageUrl}
                    alt={`Image ${i + 1}`}
                    class="h-full w-full object-cover aspect-square rounded-lg"
                  />
								</div>
							</Carousel.Item>
						{/each}
					</Carousel.Content>
					<Carousel.Previous />
					<Carousel.Next />
				</Carousel.Root>
				<div class="py-2 text-center text-sm text-muted-foreground">
					Slide {currentImageIndex} of {imageCount}
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>

<EquipmentImageDialog
  bind:isOpen={equipmentImageDialogOpen}
  equipment={equipment}
  bind:images={images}
/>
<EquipmentItemTable equipmentItems={equipmentItems} equipment={equipment} />
<EquipmentReservationTable reservations={reservations} users={users}/>