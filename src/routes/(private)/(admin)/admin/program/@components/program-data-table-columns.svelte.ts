import { renderComponent } from "$components/elements/data-table";
import type { ColumnDef } from "@tanstack/table-core";
import ProgramDataTableAction from "./program-data-table-action.svelte";
import type { Department } from "$datastores/department/department.type";
import type { Program } from "$datastores/program/program.type";

export const buildProgramDataTableColumns = (additionalData: {
  departments: Department[];
}) => {
  const programDataTableColumns: ColumnDef<{
    program: Program;
    department: Department | undefined;
  }>[] = [
    {
      header: 'ID',
      cell: ({ row }) => {
        return row.original.program.id;
      }
    },
    {
      header: 'Title',
      cell: ({ row }) => {
        return row.original.program.title;
      }
    },
    {
      header: 'Description',
      cell: ({ row }) => {
        return row.original.program.description;
      }
    },
    {
      header: 'Department',
      cell: ({ row }) => {
        return row.original.department?.name;
      }
    },
    {
      header: 'Credits Required',
      cell: ({ row }) => {
        return row.original.program.creditsRequired;
      }
    },
    {
      header: 'Duration',
      cell: ({ row }) => {
        return `${row.original.program.duration}`;
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return renderComponent(ProgramDataTableAction, { data: row.original, additionalData: additionalData });
      },
    },
  ];

  return programDataTableColumns;
};
