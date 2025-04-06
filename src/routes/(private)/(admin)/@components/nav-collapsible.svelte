<script lang="ts">
	import * as Collapsible from '$components/elements/collapsible/index.js';
	import * as Sidebar from '$components/elements/sidebar/index.js';
	import BookOpenCheck from 'lucide-svelte/icons/book-open-check';
	import CalendarFold from 'lucide-svelte/icons/calendar-fold';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import Circle from 'lucide-svelte/icons/circle';
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

  /**
   * These are the routes for the managers for different models for
   * the administration panel.
   */
	const managerRoutes: {
		title: string;
		items: item[];
	}[] = [
		{
			title: 'Academic Management',
			items: [
				{
					title: 'Semester',
          url: '/admin/semester',
					icon: BookOpenCheck
				},
				{
					title: 'Department',
          url: '/admin/department',
					icon: BookOpenCheck
				},
				{
					title: 'Program',
					url: '/admin/program',
					icon: University
				},
				{
					title: 'Course',
					url: '/admin/course',
					icon: University
				},
				{
					title: 'Class',
					url: '/admin/class',
					icon: BookOpenCheck
				},
        {
					title: 'Group',
					url: '/admin/group',
					icon: BookOpenCheck
				},
        {
					title: 'Student',
					url: '/admin/student',
					icon: BookOpenCheck
				},
			]
		},
    {
			title: 'User Management',
			items: [
				{
					title: 'User Management',
					url: '/admin/user',
					icon: CircleUser
				},
				{
					title: 'Reservation',
					url: '/admin/reservation',
					icon: Circle
				},
			]
		},
		{
			title: 'Resource Management',
			items: [
				{
					title: 'Equipment',
					url: '/admin/equipment',
					icon: BookOpenCheck
				},
				{
					title: 'Maintenance',
					url: '/admin/maintenance',
					icon: BookOpenCheck
				},
				{
					title: 'Mishandles',
					url: '/admin/mishandle',
					icon: BookOpenCheck
				},
			]
		},
	];

  /**
   * These are the routes for the analytics for the administration panel.
   */
  const analyticsRoutes: {
    title: string;
    items: item[];
  }[] = [
    {
      title: 'Reports',
      items: [
        {
          title: 'Equipment Reports',
          url: '/admin/equipment/report',
          icon: GraduationCap
        },
      ]
    },
    
    {
      title: 'Usage',
      items: [
        {
          title: 'Equipment Usage',
          url: '/admin/equipment/usage',
          icon: GraduationCap
        },
        {
          title: 'Room Usage',
          url: '/admin/room/usage',
          icon: GraduationCap
        },
      ]
    }
  ];
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Managers</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each managerRoutes as item (item.title)}
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
									<Sidebar.MenuAction {...props} class="data-[state=open]:rotate-90">
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
  <Sidebar.GroupLabel class="mt-6">Analytics</Sidebar.GroupLabel>
  <Sidebar.Menu>
		{#each analyticsRoutes as item (item.title)}
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
									<Sidebar.MenuAction {...props} class="data-[state=open]:rotate-90">
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
