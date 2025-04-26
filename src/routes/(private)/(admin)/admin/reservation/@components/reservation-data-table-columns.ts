import { renderComponent, renderSnippet } from "$components/elements/data-table";
import type { ReservationUser } from "$datastores/reservation/reservation.type";
import type { ColumnDef } from "@tanstack/table-core";
import ReservationDataTableAction from "./reservation-data-table-action.svelte";
import { getReservationStatus } from "$datastores/reservation/reservation.helper.svelte";
import { createRawSnippet } from "svelte";

export const reservationDataTableColumns: ColumnDef<ReservationUser>[] = [
  {
    accessorKey: 'id',
    header: 'Reservation ID'
  },
  {
    id: 'user',
    header: 'User',
    cell: ({ row }) => {
      return row.original.firstName + ' ' + row.original.lastName;
    }
  },
  {
    accessorKey: 'admin',
    header: 'Admin',
    cell: ({ row }) => {
      if (row.original.admin) {
        return `${row.original.admin?.firstName} ${row.original.admin?.lastName}`;
      } else {
        return '';
      }
    }
  },
  {
    accessorKey: 'class',
    header: 'Class',
    cell: ({ row }) => {
      if (row.original.class) {
        return `${row.original.class?.course?.name} ${row.original.class?.name}`;
      } else {
        return '';
      }
    }
  },
  {
    accessorKey: 'group',
    header: 'Group',
    cell: ({ row }) => {
      const groupCellSnippet = createRawSnippet<[string]>((getGroup) => {
        const group = getGroup();
        return {
          render: () => row.original.group?.name ?? ''
        };
      });
      return renderSnippet(groupCellSnippet, row.getValue('group'));
    }
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => {
      const formatter = (date: string) => new Date(date).toLocaleString();
      return formatter(row.getValue('startDate'));
    }
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => {
      const formatter = (date: string) => new Date(date).toLocaleString();
      return formatter(row.getValue('endDate'));
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (getReservationStatus(row.original).toUpperCase())
  },
  {
    accessorKey: 'accepted',
    header: 'Accepted',
    cell: ({ row }) => (row.original.accepted ? 'Yes' : 'No')
  },
  {
    accessorKey: 'claimed',
    header: 'Claimed',
    cell: ({ row }) => (row.original.claimed ? 'Yes' : 'No')
  },
  {
    accessorKey: 'returned',
    header: 'Returned',
    cell: ({ row }) => (row.original.returned ? 'Yes' : 'No')
  },
  {
    accessorKey: 'returnDate',
    header: 'Return Date',
    cell: ({ row }) => {
      const formatter = (date: string) => new Date(date).toLocaleString();
      return row.getValue('returnDate') ?formatter(row.getValue('returnDate')) : undefined;
    },
  },
  {
    accessorKey: 'reason',
    header: 'Reason'
  },
  {
    accessorKey: 'adminNote',
    header: 'Admin Note'
  },
  {
    accessorKey: 'returnNote',
    header: 'Return Note'
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return renderComponent(ReservationDataTableAction, { reservationUser: row.original });
    },
  },
];
