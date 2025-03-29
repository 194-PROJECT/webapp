<script lang="ts">
  import type { Equipment } from "$datastores/equipment/equipment.type";
  import { createEventDispatcher } from "svelte";

  export let row: Equipment;

  const dispatch = createEventDispatcher<{
    edit: Equipment;
    delete: Equipment;
  }>();
</script>

<div class="flex gap-2">
  <button
    class="btn btn-sm btn-warning"
    on:click={() => dispatch("edit", row)}
  >
    Edit
  </button>
  <button
    class="btn btn-sm btn-error"
    on:click={() => dispatch("delete", row)}
  >
    Delete
  </button>
</div>
