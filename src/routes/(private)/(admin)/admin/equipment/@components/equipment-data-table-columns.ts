import { renderComponent, renderSnippet } from "$components/elements/data-table";
import type { Equipment } from "$datastores/equipment/equipment.type";
import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import EquipmentDataTableAction from "./equipment-data-table-action.svelte";

export const equipmentDataTableColumns: ColumnDef<Equipment>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    accessorKey: 'category',
    header: 'Category'
  },
  {
    accessorKey: 'purchaseDate',
    header: 'Purchase Date',
    cell: ({ row }) => {
      const formatter = (date: Date) => date.toDateString();
      const purchaseDateCellSnippet = createRawSnippet<[string]>((getPurchaseDate) => {
        const purchaseDate = getPurchaseDate();
        return {
          render: () => `<span>${purchaseDate}</span>`
        };
      });

      return renderSnippet(purchaseDateCellSnippet, formatter(row.getValue('purchaseDate')));
    }
  },
  {
    accessorKey: 'purchasedBy',
    header: 'Purchased By',
  },
  {
    accessorKey: 'price',
    header: 'Price',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const formatter = (date: Date) => date.toDateString();
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
    header: 'Updated At',
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
      return renderComponent(EquipmentDataTableAction, { equipment: row.original });
    }
  }
];