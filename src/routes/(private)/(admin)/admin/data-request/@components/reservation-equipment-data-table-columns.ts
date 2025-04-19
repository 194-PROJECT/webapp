import { renderComponent } from "$components/elements/data-table";
import type { ColumnDef } from "@tanstack/table-core";
import ReservationEquipmentDataTableAction from "./reservation-equipment-data-table-action.svelte";
import { getReservationStatus } from "$datastores/reservation/reservation.helper.svelte";
import type { ReservationEquipment } from "$datastores/reservation-equipment/reservation-equipment.type";

export const reservationDataTableColumns: ColumnDef<ReservationEquipment>[] = [
  {
    accessorKey: 'id',
    header: 'id',
  },
  {
    id: 'user',
    header: 'User',
    cell: ({ row }) => {
      const user = row.original.reservation?.user;
      return user ? user.firstName + ' ' + user.lastName : 'Unknown';
    }
  },
  {
    id: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const user = row.original.reservation?.user;
      return user ? user.email : 'Unknown';
    }
  },
  {
    accessorKey: 'equipment.name',
    header: 'Equipment'
  },
  {
    accessorKey: 'equipmentItem.itemCode',
    header: 'Item Code'
  },
  {
    accessorKey: 'returned',
    header: 'Returned',
  },
  {
    accessorKey: 'mishandled',
    header: 'Mishandled',
  },
  {
    accessorKey: 'dataRequestDate',
    header: 'Needed By',
    cell: ({ row }) => {
      const formatter = (date: string) => new Date(date).toLocaleString();
      return row.getValue('dataRequestDate') ?formatter(row.getValue('dataRequestDate')) : undefined;
    },
  },
  {
    accessorKey: 'dataRequestDescription',
    header: 'Request Description',
  },
  {
    accessorKey: 'dataReceived',
    header: 'Data Received',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const formatter = (date: string) => new Date(date).toLocaleString();
      return row.getValue('createdAt') ?formatter(row.getValue('createdAt')) : undefined;
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) => {
      const formatter = (date: string) => new Date(date).toLocaleString();
      return row.getValue('updatedAt') ?formatter(row.getValue('updatedAt')) : undefined;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return renderComponent(ReservationEquipmentDataTableAction, { reservationEquipment: row.original });
    },
  },
];
