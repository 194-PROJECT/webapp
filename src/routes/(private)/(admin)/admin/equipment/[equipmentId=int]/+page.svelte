<script lang="ts">
	import * as Card from '$components/elements/card';
	import * as Carousel from '$components/elements/carousel';
	import type { CarouselAPI } from '$components/elements/carousel/context.js';
	import EquipmentReservationTable from './@components/equipment-reservation-data.svelte';

	let { data } = $props();
	let { equipment, reservations, images, users } = data;

  console.log('Equipment data:', equipment);
  console.log('Reservations data:', reservations);
  console.log('Images data:', images);

	let api = $state<CarouselAPI>();

	const imageCount = $derived(api ? api.scrollSnapList().length : 0);
	let currentImageIndex = $state(0);

	$effect(() => {
		if (api) {
			currentImageIndex = api.selectedScrollSnap() + 1;
			api.on('select', () => {
				currentImageIndex = api!.selectedScrollSnap() + 1;
			});
		}
	});
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
	<Card.Root>
		<Card.Content>
			<Card.Title class="text-2xl font-bold">{equipment.name}</Card.Title>
			<p class="text-1xl pb-4">{equipment.category}</p>
			<p class="text-muted-foreground">{equipment.description}</p>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Content>
			<Card.Title class="text-2xl font-medium">Purchase Details</Card.Title>
			<p class="text-1xl pb-4">{equipment.purchaseDate.toLocaleString()}</p>
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
				<p class="text-1xl">{equipment.quantity}</p>
			</div>
		</Card.Content>
	</Card.Root>
	<Card.Root class="col-span-2">
		<Card.Content>
			<Card.Title class="pb-4 text-2xl font-medium">Images</Card.Title>
			<div class="px-24">
				<Carousel.Root
					opts={{
						align: 'center',
            loop: true,
					}}
					setApi={(emblaApi) => (api = emblaApi)}
					class="w-full px-4"
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
<EquipmentReservationTable reservations={reservations} users={users}/>