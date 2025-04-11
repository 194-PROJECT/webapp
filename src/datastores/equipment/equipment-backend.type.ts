import type { EquipmentImageGetResponse } from "$datastores/equipment-image/equipment-image-backend.type";
import type { EquipmentItemGetResponse } from "$datastores/equipment-item/equipment-item-backend.type";

export interface EquipmentGetResponse {
  id: number;
  name: string;
  description: string;
  category: string;
  quantity: number;
  purchase_date: string;
  purchased_by?: string;
  price: number;
  created_at: string;
  updated_at: string;
  equipment_items?: EquipmentItemGetResponse[];
  equipment_images?: EquipmentImageGetResponse[];
}
