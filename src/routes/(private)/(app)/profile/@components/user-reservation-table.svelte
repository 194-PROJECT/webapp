<script lang="ts">
	import { goto } from '$app/navigation';
	import { Header } from '$components/elements/alert-dialog';
import Button from '$components/elements/button/button.svelte';
	import * as Table from '$components/elements/table';
	import type { Reservation } from '$datastores/reservation/reservation.type';
	import type { User } from '$datastores/user/user.type';

	const {
		reservations,
    authUser,
	}: {
		reservations: Reservation[];
    authUser: User;
	} = $props();

  const viewReservation = (reservationId: number) => {
    if (authUser.role !== 'admin') {
      goto(`/admin/reservation/${reservationId}`);
    } else {
      goto(`/reservation/${reservationId}`);
    }
  };
</script>

<Header class="flex-grow">
  <h2 class="text-2xl font-bold">My Reservations</h2>
</Header>
<Table.Root>
  <Table.Caption>List of equipment reservations</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="text-left">ID</Table.Head>
			<Table.Head>Accepted</Table.Head>
			<Table.Head>Claimed</Table.Head>
			<Table.Head>Returned</Table.Head>
			<Table.Head>End Date</Table.Head>
			<Table.Head>Start Date</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each reservations as reservation (reservation)}
			<Table.Row>
				<Table.Cell class="font-medium">{reservation.id}</Table.Cell>
				<Table.Cell>{reservation.accepted}</Table.Cell>
				<Table.Cell>{reservation.claimed}</Table.Cell>
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
