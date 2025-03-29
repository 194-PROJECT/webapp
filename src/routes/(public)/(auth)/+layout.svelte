<script lang="ts">
  import { Toaster } from "$components/elements/sonner";
  let { children } = $props();
</script>

<Toaster />

{@render children?.()}