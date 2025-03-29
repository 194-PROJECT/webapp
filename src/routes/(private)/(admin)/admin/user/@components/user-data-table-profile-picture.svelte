<script lang="ts">
	import * as Avatar from '$components/elements/avatar';
  import type { User } from '$datastores/user/user.type';

  let { user }: { user: User } = $props();
</script>

<Avatar.Root class="h-8 w-8 rounded-lg">
  <Avatar.Image src={user.profilePictureUrl} alt={user.firstName} />
  <Avatar.Fallback class="rounded-lg"
    >{user.firstName.charAt(0) + user.lastName.charAt(0)}</Avatar.Fallback
  >
</Avatar.Root>