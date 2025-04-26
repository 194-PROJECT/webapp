<script lang="ts" module>
	import User from "lucide-svelte/icons/user";
	import ChartLine from "lucide-svelte/icons/chart-line";
  import LogOut from "lucide-svelte/icons/log-out";
  import Sun from "lucide-svelte/icons/sun";

	const data = [
    [
      {
        label: "View Profile",
        icon: User,
        action: () => {
          goto("/profile", {
            invalidateAll: true,
          });
        },
      }
    ],
		[
			{
				label: "Go to Dashboard",
				icon: ChartLine,
        action: () => {
          goto("/dashboard");
        },
			},
			{
				label: "Toggle Theme",
				icon: Sun,
        action: () => {
          const htmlElement = document.querySelector('html');
          if (htmlElement) {
            const darkMode = htmlElement.classList.contains('dark');
            if (darkMode) {
              htmlElement.classList.remove('dark');
            } else {
              htmlElement.classList.add('dark');
            }
          }
        },
			},
		],
    [
      {
        label: "Logout",
        icon: LogOut,
        action: () => {
          goto("/logout", {
            invalidateAll: true,
          });
        },
      }
    ],
	];
</script>

<script lang="ts">
	import { Button } from "$components/elements/button/index.js";
	import * as Popover from "$components/elements/popover/index.js";
	import * as Sidebar from "$components/elements/sidebar/index.js";
	import Ellipsis from "lucide-svelte/icons/ellipsis";
	import { untrack } from "svelte";
	import { goto } from "$app/navigation";

	let open = $state(false);

	$effect(() => {
		untrack(() => {
			open = false;
		});
	});

  const date = (new Date()).toDateString();
</script>

<div class="flex items-center gap-2 text-sm">
	<div class="text-muted-foreground hidden font-medium md:inline-block">{ date }</div>
	<Popover.Root bind:open>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="ghost"
					size="icon"
					class="data-[state=open]:bg-accent h-7 w-7"
				>
					<Ellipsis />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-56 overflow-hidden rounded-lg p-0" align="end">
			<Sidebar.Root collapsible="none" class="bg-transparent">
				<Sidebar.Content class="gap-0">
					{#each data as group, index (index)}
						<Sidebar.Group class="border-b last:border-none">
							<Sidebar.GroupContent class="gap-0">
								<Sidebar.Menu>
									{#each group as item, index (index)}
										<Sidebar.MenuItem>
											<Sidebar.MenuButton onclick={item.action}>
												<item.icon /> <span>{item.label}</span>
											</Sidebar.MenuButton>
										</Sidebar.MenuItem>
									{/each}
								</Sidebar.Menu>
							</Sidebar.GroupContent>
						</Sidebar.Group>
					{/each}
				</Sidebar.Content>
			</Sidebar.Root>
		</Popover.Content>
	</Popover.Root>
</div>
