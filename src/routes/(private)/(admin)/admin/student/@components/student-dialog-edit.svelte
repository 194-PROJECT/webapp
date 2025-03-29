<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$components/elements/button/index.js';
	import * as Dialog from '$components/elements/dialog/index.js';
	import { Input } from '$components/elements/input/index.js';
	import { Label } from '$components/elements/label/index.js';
	import type { StudentUser } from '$datastores/student/student.type';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';

	let {
		isOpen = $bindable(false),
		student = $bindable()
	}: {
		isOpen: boolean;
		student: StudentUser;
	} = $props();

  let updatedStudent = $derived(structuredClone(student));

  const submitUpdateStudent: SubmitFunction = () => {
    return async ({ result }) => {
      if (result.type === 'success') {
        toast.success('Student updated successfully');
        goto(location.href, {
          replaceState: true,
          noScroll: true,
          keepFocus: true,
          invalidateAll: true,
        });
        isOpen = false;
      }

      if (result.type === 'failure') {
        const error = result.data?.error;
        if (typeof error === 'string') {
          toast.error(error);
        } else if (Array.isArray(error) && error.length) {
          toast.error(error[0]);
        } else {
          toast.error('An unexpected error occurred.');
        }
      }
    }
  }
</script>

<Dialog.Root bind:open={isOpen}>
  <Dialog.Content class="sm:max-w-[50vw]">
    <Dialog.Header>
      <Dialog.Title class="sm:text-3xl">{updatedStudent.firstName} {updatedStudent.lastName}</Dialog.Title>
      <Dialog.Description>
        Make changes to the student's information. 'Save changes' to apply.
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/updateStudent" use:enhance={submitUpdateStudent}>
      <div class="grid gap-4 py-4">
        <Input id="id" name="id" value={updatedStudent.id} class="hidden" />

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="studentId" class="text-right">Student ID</Label>
          <Input id="studentId" name="studentId" value={updatedStudent.studentId} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="programId" class="text-right">Program ID</Label>
          <Input id="programId" name="programId" value={updatedStudent.programId} class="col-span-3" />
        </div>
      </div>

      <Dialog.Footer>
        <Button type="submit">Save changes</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>