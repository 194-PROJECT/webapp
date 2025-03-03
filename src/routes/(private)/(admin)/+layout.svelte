<script lang="ts">
    import AppSidebar from './@components/admin-sidebar.svelte';
    import NavActions from './@components/nav-actions.svelte';
    import * as Breadcrumb from '$components/elements/breadcrumb/index.js';
    import { Separator } from '$components/elements/separator/index.js';
    import * as Sidebar from '$components/elements/sidebar/index.js';
    import { PageTransition } from '$components/elements/page-transition/index.js';
    import type { LayoutProps } from './$types';
    import SearchForm from './@components/search-form.svelte';

    let { children, data }: LayoutProps = $props();
    const { user } = data;
</script>

<Sidebar.Provider>
    <AppSidebar user={user}/>
    <Sidebar.Inset>
        <header class="flex h-14 shrink-0 items-center gap-2 bg-muted text-primary">
            <div class="flex flex-1 items-center gap-2 px-3">
                <Sidebar.Trigger />
                <Separator orientation="vertical" class="mr-2 h-4" />
                <SearchForm />
                <Breadcrumb.Root class='hidden lg:block'>
                    <Breadcrumb.List>
                        {#each data.breadcrumbs as { href, name }, index}
                            <Breadcrumb.Item>
                                <Breadcrumb.Link class="line-clamp-1" {href}>
                                    {name}
                                </Breadcrumb.Link>
                            </Breadcrumb.Item>
                            {#if index !== data.breadcrumbs.length - 1}
                                <Breadcrumb.Separator>/</Breadcrumb.Separator>
                            {/if}
                        {/each}
                    </Breadcrumb.List>
                </Breadcrumb.Root>
            </div>
            <div class="ml-auto px-3">
                <NavActions />
            </div>
        </header>

        <PageTransition key={data.url}>
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