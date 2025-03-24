import { renderComponent, renderSnippet } from "$components/elements/data-table";
import type { User } from "$datastores/user/user.type";
import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import UserDataTableAction from "./user-data-table-action.svelte";

export const userDataTableColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'id'
  },
  {
    accessorKey: 'profilePictureUrl',
    header: '',
    cell: ({ row }) => {
      const profilePictureUrlCellSnippet = createRawSnippet<[string]>((getProfilePictureUrl) => {
        const profilePictureUrl = getProfilePictureUrl();
        return {
          render: () => `<img src="${profilePictureUrl}" class="h-8 w-8 rounded-lg" />`
        };
      });

      return renderSnippet(profilePictureUrlCellSnippet, row.getValue('profilePictureUrl'));
    }
  },
  {
    accessorKey: 'firstName',
    header: 'first name'
  },
  {
    accessorKey: 'lastName',
    header: 'last name'
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
    accessorKey: 'type',
    header: 'type'
  },
  {
    accessorKey: 'role',
    header: 'roles',
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
    id: "actions",
    cell: ({ row }) => {
      // You can pass whatever you need from `row.original` to the component
      return renderComponent(UserDataTableAction, { user: row.original });
    },
  },
];