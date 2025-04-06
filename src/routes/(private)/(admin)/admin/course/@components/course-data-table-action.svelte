<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import { Button } from "$components/elements/button/index.js";
  import * as DropdownMenu from "$components/elements/dropdown-menu/index.js";
  import type { Course } from "$datastores/course/course.type";
  import { toast } from "svelte-sonner";
  import { goto } from "$app/navigation";
  import type { ActionResult } from "@sveltejs/kit";
  import { deserialize } from "$app/forms";
  import CourseDialogEdit from "./course-dialog-edit.svelte";
	import type { Program } from "$datastores/program/program.type";

  let {
    data = $bindable(),
    additionalData = $bindable()
  }: {
    data: {
      course: Course;
      program: Program | undefined;
    },
    additionalData: {
      programs: Program[];
    };
  } = $props();
  let isEditDialogOpen = $state(false);

  async function deleteCourse() {
    const response = await fetch(`?/deleteCourse`, {
      method: "POST",
      body: JSON.stringify({ id: data.course.id }),
    });

    const result: ActionResult = deserialize(await response.text());

    switch (result.type) {
      case "success": {
        toast.success(result.data?.message ?? "Course deleted successfully.");
        goto(location.href, {
          replaceState: true,
          noScroll: true,
          keepFocus: true,
          invalidateAll: true,
        });
        break;
      }
      case "failure":
        toast.error(result.data?.error ?? "An error occurred.");
        break;
    }
  }

  function toggleEditDialog() {
    isEditDialogOpen = true;
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="ghost"
        size="icon"
        class="relative size-8 p-0"
      >
        <span class="sr-only">Open menu</span>
        <Ellipsis />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
      <DropdownMenu.Item onclick={() => navigator.clipboard.writeText(data.course.name)}>
        Copy name
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item onclick={toggleEditDialog}>Edit course</DropdownMenu.Item>
    <DropdownMenu.Item onclick={deleteCourse}>Delete course</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

<CourseDialogEdit bind:isOpen={isEditDialogOpen} course={data.course} additionalData={additionalData} />
