<script lang="ts">
	import { goto } from '$app/navigation';
	import { Header } from '$components/elements/alert-dialog';
import Button from '$components/elements/button/button.svelte';
	import * as Table from '$components/elements/table';
	import { ReservationTransformer } from '$datastores/reservation/reservation.transformer';
	import type { Reservation } from '$datastores/reservation/reservation.type';
	import type { User } from '$datastores/user/user.type';

	const {
		reservations,
		users
	}: {
		reservations: Reservation[];
		users: User[];
	} = $props();

	const reservationUsers = $derived(
		ReservationTransformer.transformReservationUsers(reservations, users)
	);

  const viewReservation = (reservationId?: number) => {
    if (reservationId) {
      goto(`/admin/reservation/${reservationId}`);
    } else {
      console.error('No reservation ID provided');
    }
  };
</script>

<Header class="mb-4">
  <h2 class="text-2xl font-bold">Reservations</h2>
</Header>
<Table.Root>
  <Table.Caption>List of equipment reservations</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="text-left">ID</Table.Head>
			<Table.Head></Table.Head>
			<Table.Head>Accepted</Table.Head>
			<Table.Head>Returned</Table.Head>
			<Table.Head>End Date</Table.Head>
			<Table.Head>Start Date</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each reservationUsers as reservation (reservation)}
			<Table.Row>
				<Table.Cell class="font-medium">{reservation.id}</Table.Cell>
				<Table.Cell>
          {reservation.userId ? `${reservation.firstName} ${reservation.lastName}` : "No user"}
        </Table.Cell>
				<Table.Cell>{reservation.accepted}</Table.Cell>
				<Table.Cell>{reservation.returned}</Table.Cell>
				<Table.Cell>{reservation.endDate.toLocaleString()}</Table.Cell>
				<Table.Cell>{reservation.startDate.toLocaleString()}</Table.Cell>
				<Table.Cell>
          <Button onclick={() => viewReservation(reservation.id)}>
            <span>View Reservation</span>
          </Button>
        </Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
