<script lang="ts">
	import * as DropdownMenu from "$components/elements/dropdown-menu/index.js";
	import * as Avatar from "$components/elements/avatar/index.js";
	import { Button } from "$components/elements/button/index.js";
	import type { User } from "$datastores/user/user.type";
	import { goto } from "$app/navigation";

  let {
    authUser = $bindable()
  }: {
    authUser: User;
  } = $props();

  const toggleTheme = () => {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      const darkMode = htmlElement.classList.contains('dark');
      if (darkMode) {
        htmlElement.classList.remove('dark');
      } else {
        htmlElement.classList.add('dark');
      }
    }
  }
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button variant="ghost" class="relative h-8 w-8 rounded-full">
			<Avatar.Root class="h-8 w-8 flex item-center justify-center">
				<Avatar.Image src={authUser.profilePictureUrl} alt="@{authUser.username}" />
				<Avatar.Fallback>{authUser.firstName.charAt(0)+authUser.lastName.charAt(0)}</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">{authUser.username}</p>
				<p class="text-muted-foreground text-xs leading-none">{authUser.email}</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item onclick={() => {goto("/profile")}}>
				Profile
				<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={toggleTheme}>
				Toggle Theme
				<DropdownMenu.Shortcut>⇧⌘T</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={() => {goto("/logout")}}>
			Log out
			<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
