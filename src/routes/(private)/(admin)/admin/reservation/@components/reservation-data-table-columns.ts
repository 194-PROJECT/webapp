import { renderComponent } from "$components/elements/data-table";
import type { ReservationUser } from "$datastores/reservation/reservation.type";
import type { ColumnDef } from "@tanstack/table-core";
import ReservationDataTableAction from "./reservation-data-table-action.svelte";

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
    accessorKey: 'adminId',
    header: 'Admin ID'
  },
  {
    accessorKey: 'groupId',
    header: 'Group ID'
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
    accessorKey: 'accepted',
    header: 'Accepted',
    cell: ({ row }) => (row.getValue('accepted') ? 'Yes' : 'No')
  },
  {
    accessorKey: 'returned',
    header: 'Returned',
    cell: ({ row }) => (row.getValue('returned') ? 'Yes' : 'No')
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
