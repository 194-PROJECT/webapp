<script lang="ts">
	import { goto } from '$app/navigation';
	import { Header } from '$components/elements/alert-dialog';
import Button from '$components/elements/button/button.svelte';
	import * as Table from '$components/elements/table';
	import { getReservationStatus } from '$datastores/reservation/reservation.helper.svelte';
	import type { Reservation } from '$datastores/reservation/reservation.type';
	import ReservationTableAction from './reservation-table-action.svelte';

	const {
		reservations,
	}: {
		reservations: Reservation[];
	} = $props();

  const viewReservation = (reservationId?: number) => {
    if (reservationId) {
      goto(`/reservation/${reservationId}`);
    } else {
      console.error('No reservation ID provided');
    }
  };

  const goToCreateReservation = () => {
    goto('/reservation/create');
  };
</script>
<div class="flex">
  <Header class="flex-grow">
    <h2 class="text-2xl font-bold">My Reservations</h2>
  </Header>
  <Button class="ml-auto" onclick={() => goToCreateReservation()}>
    <span>Make a reservation</span>
  </Button>
</div>
<Table.Root>
  <Table.Caption>List of equipment reservations</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="text-left">ID</Table.Head>
      <Table.Head>Status</Table.Head>
			<Table.Head>Accepted</Table.Head>
			<Table.Head>Claimed</Table.Head>
			<Table.Head>Returned</Table.Head>
			<Table.Head>Start Date</Table.Head>
			<Table.Head>End Date</Table.Head>
			<Table.Head></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each reservations as reservation (reservation)}
			<Table.Row>
				<Table.Cell class="font-medium">{reservation.id}</Table.Cell>
        <Table.Cell>{getReservationStatus(reservation).toUpperCase()}</Table.Cell>
				<Table.Cell>{reservation.accepted}</Table.Cell>
				<Table.Cell>{reservation.claimed}</Table.Cell>
				<Table.Cell>{reservation.returned}</Table.Cell>
				<Table.Cell>{reservation.startDate.toLocaleString()}</Table.Cell>
				<Table.Cell>{reservation.endDate.toLocaleString()}</Table.Cell>
				<Table.Cell>
          <ReservationTableAction
            reservation={reservation}
          />
        </Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
