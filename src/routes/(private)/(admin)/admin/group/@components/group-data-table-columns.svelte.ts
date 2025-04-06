import { renderComponent } from "$components/elements/data-table";
import type { Group } from "$datastores/group/group.type";
import type { Class } from "$datastores/class/class.type";
import type { ColumnDef } from "@tanstack/table-core";
import GroupDataTableAction from "./group-data-table-action.svelte";
import type { User } from "$datastores/user/user.type";
import type { Semester } from "$datastores/semester/semester.type";
import type { Course } from "$datastores/course/course.type";

export const buildGroupDataTableColumns = (additionalData: {
  semesters: Semester[];
  courses: Course[];
  classes: Class[];
}) => {
  const groupDataTableColumns: ColumnDef<{
    group: Group;
    class: Class | undefined;
    semester: Semester | undefined;
    instructor: User | undefined;
  }>[] = [
    {
      header: 'ID',
      cell: ({ row }) => {
        return row.original.group.id;
      }
    },
    {
      header: 'Name',
      cell: ({ row }) => {
        return row.original.group.name;
      }
    },
    {
      header: 'Description',
      cell: ({ row }) => {
        return row.original.group.description;
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
        return renderComponent(GroupDataTableAction, { data: row.original, additionalData: additionalData });
      },
    },
  ];

  return groupDataTableColumns;
}