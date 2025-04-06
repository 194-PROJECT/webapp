import { renderComponent } from "$components/elements/data-table";
import type { ColumnDef } from "@tanstack/table-core";
import CourseDataTableAction from "./course-data-table-action.svelte";
import type { User } from "$datastores/user/user.type";
import type { Semester } from "$datastores/semester/semester.type";
import type { Course } from "$datastores/course/course.type";
import type { Program } from "$datastores/program/program.type";

export const buildClassDataTableColumns = (additionalData: {
  programs: Program[];
}) => {
  const classDataTableColumns: ColumnDef<{
    course: Course;
    program: Program | undefined;
  }>[] = [
    {
      header: 'ID',
      cell: ({ row }) => {
        return row.original.course.id;
      }
    },
    {
      header: 'Name',
      cell: ({ row }) => {
        return row.original.course.name;
      }
    },
    {
      header: 'Description',
      cell: ({ row }) => {
        return row.original.course.description;
      }
    },
    {
      header: 'Credits',
      cell: ({ row }) => {
        return row.original.course.credits;
      }
    },
    {
      header: 'Program',
      cell: ({ row }) => {
        return row.original.program?.title;
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return renderComponent(CourseDataTableAction, { data: row.original, additionalData: additionalData });
      },
    },
  ];

  return classDataTableColumns;
}
