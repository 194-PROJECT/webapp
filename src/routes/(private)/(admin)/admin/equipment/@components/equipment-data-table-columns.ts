import type { ColumnDef } from "@tanstack/table-core";
import type { Equipment } from "$datastores/equipment/equipment.type";
import EquipmentDataTableAction from "./equipment-data-table-action.svelte";

export const equipmentColumns: ColumnDef<Equipment>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.original.description;
      return description || "N/A";
    }
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;
      return category || "N/A";
    }
  },
  {
    accessorKey: "purchaseDate",
    header: "Purchase Date",
    cell: ({ row }) => {
      const purchaseDate = row.original.purchaseDate;
      return purchaseDate instanceof Date
        ? purchaseDate.toLocaleDateString()
        : new Date(purchaseDate).toLocaleDateString();
    }
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return `$${row.original.price.toFixed(2)}`;
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => ({
      component: EquipmentDataTableAction,
      props: {
        row: row.original,
      },
    }),
  },
];
