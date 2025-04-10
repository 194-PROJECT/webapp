<script>
  let reservations = [
    { id: 1, name: "John Doe", date: "2023-10-01", time: "10:00 AM" },
    { id: 2, name: "Jane Smith", date: "2023-10-02", time: "2:00 PM" },
    { id: 3, name: "Alice Johnson", date: "2023-10-03", time: "6:00 PM" }
  ];
</script>

<h1>Reservations</h1>
<ul>
  {#each reservations as reservation}
    <li>
      <strong>{reservation.name}</strong> - {reservation.date} at {reservation.time}
    </li>
  {/each}
</ul>

TODO