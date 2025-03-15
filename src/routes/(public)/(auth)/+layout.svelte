<script lang="ts">
  import { Toaster } from "$components/elements/sonner/index.js";
  let { children } = $props();
</script>

<Toaster />

{@render children?.()}