<script lang="ts">
	import AppSidebar from './@components/admin-sidebar.svelte';
	import NavActions from './@components/nav-actions.svelte';
	import * as Breadcrumb from '$components/elements/breadcrumb/index.js';
	import { Separator } from '$components/elements/separator/index.js';
	import * as Sidebar from '$components/elements/sidebar/index.js';
	import { PageTransition } from '$components/elements/page-transition/index.js';
	import type { LayoutProps } from './$types';
	import SearchForm from './@components/search-form.svelte';
	import { Toaster } from '$components/elements/sonner';

	let { children, data }: LayoutProps = $props();
	const { authUser, url, breadcrumbs } = $derived(data);
</script>

<Toaster />

<Sidebar.Provider>
	<AppSidebar user={authUser} />
	<Sidebar.Inset>
		<header class="flex h-14 shrink-0 items-center gap-2 bg-muted text-primary">
			<div class="flex flex-1 items-center gap-2 px-3">
				<Sidebar.Trigger />
				<Separator orientation="vertical" class="mr-2 h-4" />
				<SearchForm />
				<Breadcrumb.Root class="hidden lg:block">
          {#key [breadcrumbs]}
            <Breadcrumb.List>
              {#each breadcrumbs as { href, name }, index}
                <Breadcrumb.Item>
                  <Breadcrumb.Link class="line-clamp-1" {href}>
                    {name}
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                {#if index !== breadcrumbs.length - 1}
                  <Breadcrumb.Separator>/</Breadcrumb.Separator>
                {/if}
              {/each}
            </Breadcrumb.List>
          {/key}
				</Breadcrumb.Root>
			</div>
			<div class="ml-auto px-3">
				<NavActions />
			</div>
		</header>

		<PageTransition key={url}>
			<div class="flex flex-1 flex-col gap-4 px-4 py-10">
				{@render children()}
			</div>
		</PageTransition>
	</Sidebar.Inset>
</Sidebar.Provider>

<style>
	.bg-muted {
		background-color: var(--color-muted);
	}

	.text-primary {
		color: var(--color-primary);
	}
</style>
