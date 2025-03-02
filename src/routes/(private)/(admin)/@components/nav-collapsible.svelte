<script lang="ts">
	import * as Collapsible from '$components/elements/collapsible/index.js';
	import * as Sidebar from '$components/elements/sidebar/index.js';
  import BookOpenCheck from 'lucide-svelte/icons/book-open-check';
	import CalendarFold from 'lucide-svelte/icons/calendar-fold';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import CircleUser from 'lucide-svelte/icons/circle-user';
  import GraduationCap from 'lucide-svelte/icons/graduation-cap';
  import University from 'lucide-svelte/icons/university';

	interface item {
		title: string;
		url: string;
    // This should be `Component` after lucide-svelte updates types
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon?: any;
		isActive?: boolean;
	}

	const data: {
		title: string;
		items: item[];
	}[] = [
		{
			title: 'Academic Management',
			items: [
				{
					title: 'User',
					url: '/admin/user',
          icon: CircleUser
				},
				{
					title: 'Course',
					url: '/admin/course',
          icon: BookOpenCheck
				},
				{
					title: 'Program',
					url: '/admin/program',
          icon: GraduationCap,
				},
				{
					title: 'Department',
					url: '/admin/department',
          icon: University,
				},
				{
					title: 'Semester',
					url: '/admin/semester',
          icon: CalendarFold
				},
			]
		},
    {
      title: 'Resource Management',
      items: [
        {
					title: 'Asset',
					url: '/admin/asset',
          icon: CircleUser
				},
				{
					title: 'Inventory',
					url: '/admin/inventory',
          icon: BookOpenCheck
				},
				{
					title: 'Room',
					url: '/admin/room',
          icon: BookOpenCheck
				},
      ]
    }
	];
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Managers</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each data as item (item.title)}
			<Collapsible.Root>
				{#snippet child({ props })}
					<Sidebar.MenuItem {...props}>
						<Sidebar.MenuButton>
							{#snippet tooltipContent()}
								{item.title}
							{/snippet}
							<span>{item.title}</span>
						</Sidebar.MenuButton>
						{#if item.items?.length}
							<Collapsible.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuAction
										{...props}
										class="data-[state=open]:rotate-90"
									>
										<ChevronRight />
										<span class="sr-only">Toggle</span>
									</Sidebar.MenuAction>
								{/snippet}
							</Collapsible.Trigger>
							<Collapsible.Content>
								<Sidebar.MenuSub>
									{#each item.items as subItem (subItem.title)}
										<Sidebar.MenuSubItem>
											<Sidebar.MenuSubButton href={subItem.url}>
												<span>{subItem.title}</span>
											</Sidebar.MenuSubButton>
										</Sidebar.MenuSubItem>
									{/each}
								</Sidebar.MenuSub>
							</Collapsible.Content>
						{/if}
					</Sidebar.MenuItem>
				{/snippet}
			</Collapsible.Root>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
