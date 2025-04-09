<script lang="ts">
	import { Header } from "$components/elements/alert-dialog";
import * as Avatar from "$components/elements/avatar";
	import Button from "$components/elements/button/button.svelte";
	import * as Card from "$components/elements/card";
	import Separator from "$components/elements/separator/separator.svelte";
	import type { PageProps } from "./$types";
	import UserDialogEdit from "./@components/user-dialog-edit.svelte";
	import UserReservationTable from "./@components/user-reservation-table.svelte";

  let { data }: PageProps = $props();
  let {
    user,
    reservations,
    handledReservations,
  } = $derived(data);

  let isEditDialogOpen = $state(false);

  const toggleEditDialog = () => {
    isEditDialogOpen = !isEditDialogOpen;
  };
</script>

<UserDialogEdit
  user={user}
  bind:isOpen={isEditDialogOpen}
/>

<Header class="flex-grow">
  <h2 class="text-2xl font-bold">User Details</h2>
</Header>
<Separator class="my-4" />
<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-12 mb-4">
  <Card.Root class="col-span-2 h-fit w-full">
		<Card.Content>
			<Card.Title class="md:text-1xl lg:text-2xl font-bold mb-4">{user.username}</Card.Title>
      <div class="flex items-center justify-center">
        <div class="flex-grow-1 h-full w-full">
          <Avatar.Root class="h-full w-full rounded-lg">
            <Avatar.Image src={user.profilePictureUrl} alt={user.firstName.charAt(0) + user.firstName.charAt(1)} />
            <Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
          </Avatar.Root>
        </div>
      </div>
		</Card.Content>
	</Card.Root>

  <Card.Root class="col-span-4">
		<Card.Content>
      <div class="flex items-center">
        <div class="flex-grow">
          <Card.Title class="text-2xl font-bold">{user.firstName} {user.lastName}</Card.Title>
          <p class="text-1xl"><span class="font-bold">Email:</span> {user.email}</p>
        </div>
        <Button onclick={toggleEditDialog} class="">Edit user details</Button>
      </div>
      <Separator class="my-4" />
      <div class="flex items-center">
        <p class="text-1xl flex-grow font-bold">Username:</p>
        <p class="text-1xl">{user.username}</p>
      </div>
      <div class="flex items-center">
        <p class="text-1xl flex-grow font-bold">First Name:</p>
        <p class="text-1xl">{user.firstName}</p>
      </div>
      <div class="flex items-center">
        <p class="text-1xl flex-grow font-bold">Last Name:</p>
        <p class="text-1xl">{user.lastName}</p>
      </div>
      <Separator class="my-4" />
      <div class="flex items-center">
        <p class="text-1xl flex-grow font-bold">Account Type:</p>
        <p class="text-1xl">{user.type}</p>
      </div>
      <div class="flex items-center">
        <p class="text-1xl flex-grow font-bold">Role:</p>
        <p class="text-1xl">{user.role}</p>
      </div>
      <div class="flex items-center">
        <p class="text-1xl flex-grow font-bold">Create Date:</p>
        <p class="text-1xl">{user.createdAt?.toLocaleString()}</p>
      </div>
      <div class="flex items-center">
        <p class="text-1xl flex-grow font-bold">Update Date:</p>
        <p class="text-1xl">{user.updatedAt?.toLocaleString()}</p>
      </div>
		</Card.Content>
	</Card.Root>

  <div class="col-span-6">
    <UserReservationTable
      reservations={reservations}
    />
  </div>
</div>

