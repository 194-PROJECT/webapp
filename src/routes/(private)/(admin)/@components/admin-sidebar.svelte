<script lang="ts" module>
	import AudioWaveform from 'lucide-svelte/icons/audio-waveform';
	import Command from 'lucide-svelte/icons/command';
	// This is sample data.
	const data = {
		teams: [
			{
				name: 'Acme Inc',
				logo: Command,
				plan: 'Enterprise'
			},
			{
				name: 'Acme Corp.',
				logo: AudioWaveform,
				plan: 'Startup'
			},
			{
				name: 'Evil Corp.',
				logo: Command,
				plan: 'Free'
			}
		]
	};
</script>

<script lang="ts">
	import NavigationMain from './nav-main.svelte';
	import NavigationSecondary from './nav-secondary.svelte';
	import NavigationHeaderLogo from './nav-header-logo.svelte';
	import NavigationCollapsible from './nav-collapsible.svelte';
	import NavigationUser from './nav-user.svelte';
	import * as Sidebar from '$components/elements/sidebar/index.js';
	import { ScrollArea } from '$components/elements/scroll-area/index.js';
	import type { ComponentProps } from 'svelte';
	import type { User } from '$datastores/user/user.type';

	let { ref = $bindable(null), user, ...restProps }: ComponentProps<typeof Sidebar.Root> & {
    user: User
  } = $props();
</script>

<Sidebar.Root bind:ref class="border-r-0" {...restProps}>
	<Sidebar.Header>
		<NavigationHeaderLogo />
		<NavigationMain />
	</Sidebar.Header>
	<Sidebar.Content>
		<ScrollArea>
			<NavigationCollapsible />
		</ScrollArea>
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavigationSecondary class="mt-auto" />
    <NavigationUser user={user} />
	</Sidebar.Footer>
</Sidebar.Root>
