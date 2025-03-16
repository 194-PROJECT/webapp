<script lang="ts">
	import DataTable from './@components/user-data-table.svelte';
	import { userDataTableColumns } from './@components/user-data-table-columns';

  const { data } = $props();
  const { users } = $derived(data);
</script>

<div class="mx-auto h-auto w-full max-w-6xl rounded-xl bg-muted/50">
	<DataTable data={users ?? []} columns={userDataTableColumns} />
</div>