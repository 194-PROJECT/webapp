import type { EquipmentImage } from "$datastores/equipment-image/equipment-image.type";
import type { EquipmentItem } from "$datastores/equipment-item/equipment-item.type";

export interface Equipment {
  id: number;
  name: string;
  description: string;
  category: string;
  quantity: number;
  purchaseDate: Date;
  purchasedBy?: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  items?: EquipmentItem[];
  images?: EquipmentImage[];
}

export enum EquipmentCategory {
  ACCESSORY = "accessory",
  INSTRUMENT = "instrument",
  TOOL = "tool",
  OTHER = "other",
}

export type equipmentView = 'available';
