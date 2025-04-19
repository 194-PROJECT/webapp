<script lang="ts">
	import * as Avatar from "$components/elements/avatar/index.js";
	import { getReservationStatus } from "$datastores/reservation/reservation.helper.svelte";
	import type { Reservation } from "$datastores/reservation/reservation.type";
	import type { User } from "$datastores/user/user.type";

  let { recentReservations }: {
    recentReservations: (Reservation & { user?: User })[];
  } = $props();
</script>

<div class="space-y-8">
  {#each recentReservations as reservation (reservation)}
    <div class="flex items-center">
      <Avatar.Root class="h-9 w-9">
        <Avatar.Image src={reservation.user?.profilePictureUrl} alt="Avatar" />
        <Avatar.Fallback>{reservation.user?.firstName.slice(0,2)}</Avatar.Fallback>
      </Avatar.Root>
      <div class="ml-4 space-y-1">
        <p class="text-sm font-medium leading-none">{reservation.user?.firstName} {reservation.user?.lastName}</p>
        <p class="text-muted-foreground text-sm">{reservation.user?.email}</p>
      </div>
      <div class="ml-auto font-medium">{getReservationStatus(reservation)}</div>
    </div>
  {/each}
</div>
