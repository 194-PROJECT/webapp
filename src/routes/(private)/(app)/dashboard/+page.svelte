<script lang="ts">
  import Activity from "lucide-svelte/icons/activity";
	import CreditCard from "lucide-svelte/icons/credit-card";
	import Users from "lucide-svelte/icons/users";

	import { Bar } from "$components/blocks/charts";
	import * as Card from "$components/elements/card";
	import * as Tabs from "$components/elements/tabs";
	import RecentReservations from "./@components/recent-reservations.svelte";
	import { CalendarDate } from "@internationalized/date";
	import Separator from "$components/elements/separator/separator.svelte";
	import { UserRole } from "$core/auth/auth.type";

  let { data } = $props();
  let {
    authUser,
    userCount,
    equipmentCount,
    reservationCount,
    equipmentItemCount,
    recentReservations,
    reservationMadePerMonth,
  } = $derived(data);

  let value = $state({
    start: new CalendarDate(2022, 0, 20),
    end: new CalendarDate(2022, 0, 20).add({ days: 20 })
  });
</script>

<div class="flex items-center justify-between space-y-2">
  <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
  <div class="flex items-center space-x-2">
    {new Date().toDateString()}
  </div>
</div>
<Separator class="my-4" />

<Tabs.Root value="overview" class="space-y-4">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    {#if authUser?.role === UserRole.ADMIN}
      <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
      <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
    {/if}
  </Tabs.List>

  <Tabs.Content value="overview" class="space-y-4">
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card.Root>
        <Card.Header
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <Card.Title class="text-sm font-medium">Users</Card.Title>
          <Users class="text-muted-foreground h-4 w-4" />
        </Card.Header>
        <Card.Content>
          <div class="text-2xl font-bold flex items-end">
            <p class="flex-grow">{userCount}</p>
          </div>
        </Card.Content>
      </Card.Root>
      <Card.Root>
        <Card.Header
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <Card.Title class="text-sm font-medium">Equipments</Card.Title>
          <Users class="text-muted-foreground h-4 w-4" />
        </Card.Header>
        <Card.Content>
          <div class="text-2xl font-bold flex items-end">
            <p class="flex-grow">{equipmentCount}</p>
          </div>
        </Card.Content>
      </Card.Root>
      <Card.Root>
        <Card.Header
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <Card.Title class="text-sm font-medium">Reservations</Card.Title>
          <CreditCard class="text-muted-foreground h-4 w-4" />
        </Card.Header>
        <Card.Content>
            <div class="text-2xl font-bold flex items-end">
              <p class="flex-grow">{reservationCount}</p>
            </div>
        </Card.Content>
      </Card.Root>
      <Card.Root>
        <Card.Header
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <Card.Title class="text-sm font-medium">Usable Items</Card.Title>
          <Activity class="text-muted-foreground h-4 w-4" />
        </Card.Header>
        <Card.Content>
          <div class="text-2xl font-bold">{equipmentItemCount}</div>
        </Card.Content>
      </Card.Root>
    </div>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card.Root class="col-span-4">
        <Card.Header>
            <Card.Title>Reservations Made Per Month</Card.Title>
        </Card.Header>
        <Card.Content>
          <Bar dataset={reservationMadePerMonth} />
        </Card.Content>
      </Card.Root>
      <Card.Root class="col-span-3">
        <Card.Header>
          <Card.Title>Recent Reservations</Card.Title>
            <Card.Description>
              A summary of the most recent reservations made by users.
            </Card.Description>
        </Card.Header>
        <Card.Content>
          <RecentReservations {recentReservations} />
        </Card.Content>
      </Card.Root>
    </div>
  </Tabs.Content>

  <Tabs.Content value="analytics" class="space-y-4">
    Analytics content goes here.
  </Tabs.Content>

  <Tabs.Content value="reports" class="space-y-4">
    Reports goes here.
  </Tabs.Content>

</Tabs.Root>