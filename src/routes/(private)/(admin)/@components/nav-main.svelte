<script lang="ts">
	import * as Sidebar from '$components/elements/sidebar/index.js';
	import House from 'lucide-svelte/icons/house';
	import Inbox from 'lucide-svelte/icons/inbox';

	const items: {
		title: string;
		url: string;
		// This should be `Component` after lucide-svelte updates types
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon: any;
		isActive?: boolean;
		badge?: string;
	}[] = [
		{
			title: 'Home',
			url: '/admin',
			icon: House,
			isActive: true
		},
		// {
		// 	title: 'Inbox',
		// 	url: '/inbox',
		// 	icon: Inbox,
		// 	badge: '10'
		// }
	];
</script>

<Sidebar.Menu>
	{#each items as item (item.title)}
		<Sidebar.MenuItem>
			<Sidebar.MenuButton isActive={item.isActive}>
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
