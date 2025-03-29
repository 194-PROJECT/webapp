<script lang="ts">
	import * as Avatar from '$components/elements/avatar';
  import type { StudentUser } from '$datastores/student/student.type';

  let { student }: { student: StudentUser } = $props();
</script>

<Avatar.Root class="h-8 w-8 rounded-lg">
  <Avatar.Image src={student.profilePictureUrl} alt={student.firstName} />
  <Avatar.Fallback class="rounded-lg"
    >{student.firstName.charAt(0) + student.lastName.charAt(0)}</Avatar.Fallback
  >
</Avatar.Root>
