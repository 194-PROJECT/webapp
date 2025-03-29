import { renderComponent, renderSnippet } from "$components/elements/data-table";
import type { Student, StudentUser } from "$datastores/student/student.type";
import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import StudentDataTableAction from "./student-data-table-action.svelte";
import StudentDataTableProfilePicture from "./student-data-table-profile-picture.svelte";

// export const buildStudentDataTableColumns = (programs) => {

// }

export const studentDataTableColumns: ColumnDef<StudentUser>[] = [
  {
    accessorKey: 'id',
    header: 'id'
  },
  {
    accessorKey: 'profilePictureUrl',
    header: '',
    id: 'profilePictureUrl',
    cell: ({ row }) => {
      return renderComponent(StudentDataTableProfilePicture, { student: row.original });
    },
  },
  {
    accessorKey: 'studentId',
    header: 'student id'
  },
  {
    accessorKey: 'programId',
    header: 'program id'
  },
  {
    accessorKey: 'username',
    header: 'username'
  },
  {
    accessorKey: 'email',
    header: 'email'
  },
  {
    accessorKey: 'createdAt',
    header: 'created at',
    cell: ({ row }) => {
      const formatter = (date: string) => new Date(date).toDateString();
      const createdAtCellSnippet = createRawSnippet<[string]>((getCreatedAt) => {
        const createdAt = getCreatedAt();
        return {
          render: () => `<span>${createdAt}</span>`
        };
      });

      return renderSnippet(createdAtCellSnippet, formatter(row.getValue('createdAt')));
    }
  },
  {
    accessorKey: 'updatedAt',
    header: 'updated at',
    cell: ({ row }) => {
      const formatter = (date: string) => new Date(date).toDateString();
      const updatedAtCellSnippet = createRawSnippet<[string]>((getUpdatedAt) => {
        const updatedAt = getUpdatedAt();
        return {
          render: () => `<span>${updatedAt}</span>`
        };
      });

      return renderSnippet(updatedAtCellSnippet, formatter(row.getValue('updatedAt')));
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      // You can pass whatever you need from `row.original` to the component
      return renderComponent(StudentDataTableAction, { student: row.original });
    },
  },
];
