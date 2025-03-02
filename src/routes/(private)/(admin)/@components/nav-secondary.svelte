<script lang="ts">
	import * as Sidebar from '$components/elements/sidebar/index.js';
	import Blocks from 'lucide-svelte/icons/blocks';
	import Calendar from 'lucide-svelte/icons/calendar';
	import MessageCircleQuestion from 'lucide-svelte/icons/message-circle-question';
	import Settings_2 from 'lucide-svelte/icons/settings-2';
	import Trash_2 from 'lucide-svelte/icons/trash-2';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Group> = $props();

	const items: {
		title: string;
		url: string;
		// This should be `Component` after lucide-svelte updates types
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon: any;
		badge?: string;
	}[] = [
		{
			title: 'Calendar',
			url: '#',
			icon: Calendar,
      badge: '10'
		},
		{
			title: 'Settings',
			url: '#',
			icon: Settings_2
		},
		{
			title: 'Help',
			url: '#',
			icon: MessageCircleQuestion
		}
	];
</script>

<Sidebar.Group bind:ref {...restProps}>
	<Sidebar.GroupContent>
		<Sidebar.Menu>
			{#each items as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						{#snippet child({ props })}
							<a href={item.url} {...props}>
								<item.icon />
								<span>{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
					{#if item.badge}
						<Sidebar.MenuBadge>{item.badge}</Sidebar.MenuBadge>
					{/if}
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
