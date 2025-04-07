import { renderComponent } from "$components/elements/data-table";
import type { ColumnDef } from "@tanstack/table-core";
import DepartmentDataTableAction from "./department-data-table-action.svelte";
import type { Department } from "$datastores/department/department.type";

export const buildDepartmentDataTableColumns = (additionalData: {}) => {
  const departmentDataTableColumns: ColumnDef<{
    department: Department;
  }>[] = [
    {
      header: 'ID',
      cell: ({ row }) => {
        return row.original.department.id;
      }
    },
    {
      header: 'Name',
      cell: ({ row }) => {
        return row.original.department.name;
      }
    },
    {
      header: 'Description',
      cell: ({ row }) => {
        return row.original.department.description;
      }
    },
    {
      header: 'Created At',
      cell: ({ row }) => {
        return row.original.department.createdAt;
      }
    },
    {
      header: 'Updated At',
      cell: ({ row }) => {
        return row.original.department.updatedAt;
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return renderComponent(DepartmentDataTableAction, { data: row.original, additionalData: additionalData });
      },
    },
  ];

  return departmentDataTableColumns;
};
