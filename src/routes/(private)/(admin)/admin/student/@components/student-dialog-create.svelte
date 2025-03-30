<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$components/elements/button/index.js';
	import * as Dialog from '$components/elements/dialog/index.js';
	import { Input } from '$components/elements/input/index.js';
	import { Label } from '$components/elements/label/index.js';
	import * as Select from '$components/elements/select';
	import { UserRole, UserType } from '$core/auth/auth.type';
	import type { Student } from '$datastores/student/student.type';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { unknown } from 'zod';

	let {
		isOpen = $bindable(false),
	}: {
		isOpen: boolean;
	} = $props();

  let initialStudent = {
    userId: undefined,
    programId: undefined,
    studentId: undefined,
  } as Partial<Student>;

  let student = $state(structuredClone(initialStudent));
  let formLoading = $state(false);

  const submitCreateStudent: SubmitFunction = () => {
    formLoading = true;
    return async ({ result, update }) => {
      if (result.type === 'success') {
        toast.success('Student created successfully');
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

      formLoading = false;
    }
  }
</script>

<Dialog.Root bind:open={isOpen}>
  <Dialog.Content class="sm:max-w-[50vw]">
    <Dialog.Header>
      <Dialog.Title class="sm:text-3xl">Create Student</Dialog.Title>
      <Dialog.Description>
        Fill out the form below to create a new student. Ensure all required fields are completed accurately.
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/createStudent" use:enhance={submitCreateStudent}>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="userId" class="text-right">User ID</Label>
          <Input id="userId" name="userId" value={student.userId} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="studentId" class="text-right">Student ID</Label>
          <Input id="studentId" name="studentId" value={student.studentId} class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="programId" class="text-right">Program ID</Label>
          <Input id="programId" name="programId" value={student.programId} class="col-span-3" />
        </div>
      </div>

      <Dialog.Footer>
        <Button type="submit" disabled={formLoading}>Create student</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
