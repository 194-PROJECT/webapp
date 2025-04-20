<script lang="ts">
	import { page } from "$app/state";
	import { cn } from "$lib/utils.js";

  let {
    class: className = $bindable()
  }: {
    class?: string | null;
  } = $props();

  let currentPath = $derived(page.url.pathname.split("/")[1]);
</script>

{#key currentPath}
  <nav class={cn("flex items-center space-x-4 lg:space-x-6", className)}>
    <a href="/dashboard" class={cn(
        "hover:text-primary text-sm font-medium transition-colors",
        currentPath !== "dashboard" && "text-muted-foreground"
      )}
    >
      Dashboard
    </a>
    <a
      href="/reservation" class={cn(
        "hover:text-primary text-sm font-medium transition-colors",
        currentPath !== "reservation" && "text-muted-foreground"
      )}
    >
      Reservations
    </a>
    <a
      href="/mishandle" class={cn(
        "hover:text-primary text-sm font-medium transition-colors",
        currentPath !== "mishandle" && "text-muted-foreground"
      )}
    >
      Mishandles
    </a>
    <a
    href="/data-request" class={cn(
      "hover:text-primary text-sm font-medium transition-colors",
      currentPath !== "data-request" && "text-muted-foreground"
    )}
  >
    Data Requests
  </a>
  </nav>
{/key}
