<script lang="ts">
	import MainNavigation from "./@components/main-navigation.svelte";
	import UserNav from "./@components/user-nav.svelte";
	import { UserRole } from "$core/auth/auth.type";
	import { Toaster } from "$components/elements/sonner";

  let { children, data } = $props();
  let { authUser } = $derived(data);
</script>

<Toaster closeButton position="bottom-left"/>
<div class="flex flex-col">
	<div class="border-b">
		<div class="flex h-16 items-center px-4">
			<MainNavigation class="mx-6" />
			<div class="ml-auto flex items-center space-x-4">
        {#if authUser?.role === UserRole.ADMIN}
          <a
            href="/admin"
            class="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
          >
            Admin
          </a>
        {/if}
        <UserNav {authUser} />
			</div>
		</div>
	</div>
	<div class="flex-1 space-y-4 p-8 pt-6">
    {@render children()}
	</div>
</div>
