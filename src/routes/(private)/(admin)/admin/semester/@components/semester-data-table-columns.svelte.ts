import { renderComponent } from "$components/elements/data-table";
import type { ColumnDef } from "@tanstack/table-core";
import SemesterDataTableAction from "./semester-data-table-action.svelte";
import type { Semester } from "$datastores/semester/semester.type";

export const buildSemesterDataTableColumns = (additionalData: {}) => {
  const semesterDataTableColumns: ColumnDef<{
    semester: Semester;
  }>[] = [
    {
      header: 'ID',
      cell: ({ row }) => {
        return row.original.semester.id;
      }
    },
    {
      header: 'Name',
      cell: ({ row }) => {
        return row.original.semester.name;
      }
    },
    {
      header: 'Start Date',
      cell: ({ row }) => {
        return row.original.semester.startDate.toLocaleDateString();
      }
    },
    {
      header: 'End Date',
      cell: ({ row }) => {
        return row.original.semester.endDate.toLocaleDateString();
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return renderComponent(SemesterDataTableAction, { data: row.original, additionalData: additionalData });
      },
    },
  ];

  return semesterDataTableColumns;
};
