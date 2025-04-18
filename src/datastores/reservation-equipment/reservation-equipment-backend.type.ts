import type { MishandleType } from "./reservation-equipment.type";

export interface ReservationEquipmentGetResponse {
  id?: number;
  reservation_id: number;
  equipment_id?: number;
  equipment_item_id?: number;
  returned?: boolean;
  mishandled?: boolean;
  mishandle_type: MishandleType;
  mishandle_description: string;
  rating?: number;
  comment?: string;
  admin_note?: string;
  created_at?: Date;
  updated_at?: Date;
}
