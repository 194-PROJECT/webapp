import { renderComponent, renderSnippet } from "$components/elements/data-table";
import type { Group } from "$datastores/group/group.type";
import type { Class } from "$datastores/class/class.type";
import type { ColumnDef } from "@tanstack/table-core";
import GroupDataTableAction from "./group-data-table-action.svelte";
import type { User } from "$datastores/user/user.type";
import type { Semester } from "$datastores/semester/semester.type";
import type { PageData } from "../$types";

export const groupDataTableColumns: ColumnDef<{
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
			return renderComponent(GroupDataTableAction, { data: row.original });
		},
	},
];