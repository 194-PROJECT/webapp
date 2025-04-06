<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$components/elements/button/index.js';
	import * as Dialog from '$components/elements/dialog/index.js';
	import { Input } from '$components/elements/input/index.js';
	import { Label } from '$components/elements/label/index.js';
	import type { Class } from '$datastores/class/class.type';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import type { Semester } from '$datastores/semester/semester.type';
	import type { Course } from '$datastores/course/course.type';
	import * as Select from '$components/elements/select';
	import type { User } from '$datastores/user/user.type';

	let {
		isOpen = $bindable(false),
		classItem = $bindable(),
    additionalData,
	}: {
		isOpen: boolean;
		classItem: Class;
    additionalData: {
      semesters: Semester[];
      instructors: User[];
      courses: Course[];
    };
	} = $props();

	let updatedClass = $derived(structuredClone(classItem));
	let formLoading = $state(false);

  let semesterId = $state((classItem.semesterId ?? 1).toString());
  let courseId = $state((classItem.courseId ?? 1).toString());
  let instructorId = $state((classItem.instructorId ?? 1).toString());

  let courseOptions = $derived.by(() => {
    return additionalData.courses.map((course) => ({
      value: course.id.toString(),
      label: course.name,
    }));
  });

  let semesterOptions = $derived.by(() => {
    return additionalData.semesters.map((semester) => ({
      value: semester.id.toString(),
      label: semester.name,
    }));
  });

  let instructorOptions = $derived.by(() => {
    return additionalData.instructors.map((instructor) => ({
      value: instructor.id.toString(),
      label: `${instructor.firstName} ${instructor.lastName}`,
    }));
  });

  let courseTriggerContent = $derived(courseOptions.find((f) => f.value === courseId)?.label ?? 'Course name');
  let semesterTriggerContent = $derived(semesterOptions.find((f) => f.value === semesterId)?.label ?? 'Semester');
  let instructorTriggerContent = $derived(instructorOptions.find((f) => f.value === instructorId)?.label ?? 'Instructor name');

	const submitUpdateClass: SubmitFunction = () => {
		formLoading = true;

		return async ({ result }) => {
			if (result.type === 'success') {
				toast.success('Class updated successfully');
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
		};
	};
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content class="sm:max-w-[50vw]">
		<Dialog.Header>
			<Dialog.Title class="sm:text-3xl">{updatedClass.name}</Dialog.Title>
			<Dialog.Description>
				Make changes to the class's information. 'Save changes' to apply.
			</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/updateClass" use:enhance={submitUpdateClass}>
			<div class="grid gap-4 py-4">
				<Input id="id" name="id" value={updatedClass.id} class="hidden" />

				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="semesterId" class="text-right">Semester</Label>
					<Input id="semesterId" name="semesterId" bind:value={semesterId} class="hidden" />
          <Select.Root
            type="single"
            name="pageSize"
            bind:value={semesterId}
          >
            <Select.Trigger class="col-span-3">
              {semesterTriggerContent}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.GroupHeading>Semester</Select.GroupHeading>
                {#each semesterOptions as semesterOption (semesterOption.value)}
                  <Select.Item value={semesterOption.value} label={semesterOption.label} />
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
				</div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="courseId" class="text-right">Course</Label>
          <Input id="courseId" name="courseId" bind:value={courseId} class="hidden" />
          <Select.Root
            type="single"
            name="courseId"
            bind:value={courseId}
          >
            <Select.Trigger class="col-span-3">
              {courseTriggerContent}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.GroupHeading>Courses</Select.GroupHeading>
                {#each courseOptions as courseOption (courseOption.value)}
                  <Select.Item value={courseOption.value} label={courseOption.label} />
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="instructorId" class="text-right">Instructor</Label>
          <Input id="instructorId" name="instructorId" bind:value={instructorId} class="hidden" />
          <Select.Root
            type="single"
            name="instructorId"
            bind:value={instructorId}
          >
            <Select.Trigger class="col-span-3">
              {instructorTriggerContent}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.GroupHeading>Instructors</Select.GroupHeading>
                {#each instructorOptions as instructorOption (instructorOption.value)}
                  <Select.Item value={instructorOption.value} label={instructorOption.label} />
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>

				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="name" class="text-right">Name</Label>
					<Input id="name" name="name" value={updatedClass.name} class="col-span-3" />
				</div>

				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="description" class="text-right">Description</Label>
					<Input id="description" name="description" value={updatedClass.description} class="col-span-3" />
				</div>
			</div>

			<Dialog.Footer>
				<Button type="submit" disabled={formLoading}>Save changes</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>