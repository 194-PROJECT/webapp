import { renderComponent } from "$components/elements/data-table";
import type { Class } from "$datastores/class/class.type";
import type { ColumnDef } from "@tanstack/table-core";
import ClassDataTableAction from "./program-data-table-action.svelte";
import type { User } from "$datastores/user/user.type";
import type { Semester } from "$datastores/semester/semester.type";
import type { Course } from "$datastores/course/course.type";

export const buildProgramDataTableColumns = (additionalData: {
  semesters: Semester[];
  instructors: User[];
  courses: Course[];
}) => {
  const classDataTableColumns: ColumnDef<{
    class: Class;
    course: Course | undefined;
    semester: Semester | undefined;
    instructor: User | undefined;
  }>[] = [
    {
      header: 'ID',
      cell: ({ row }) => {
        return row.original.class.id;
      }
    },
    {
      header: 'Name',
      cell: ({ row }) => {
        return row.original.class.name;
      }
    },
    {
      header: 'Description',
      cell: ({ row }) => {
        return row.original.class.description;
      }
    },
    {
      header: 'Start Date',
      cell: ({ row }) => {
        return row.original.semester?.startDate.toLocaleDateString();
      }
    },
    {
      header: 'End Date',
      cell: ({ row }) => {
        return row.original.semester?.endDate.toLocaleDateString();
      }
    },
    {
      header: 'Class',
      cell: ({ row }) => {
        return row.original.class?.name;
      }
    },
    {
      header: 'Instructor',
      cell: ({ row }) => {
        return `${row.original.instructor?.firstName} ${row.original.instructor?.lastName}`;
      }
    },
    {
      header: 'Semester',
      cell: ({ row }) => {
        return row.original.semester?.name;
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return renderComponent(ClassDataTableAction, { data: row.original, additionalData: additionalData });
      },
    },
  ];

  return classDataTableColumns;
}