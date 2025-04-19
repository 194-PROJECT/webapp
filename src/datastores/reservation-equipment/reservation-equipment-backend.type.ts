import type { EquipmentItemGetResponse } from "$datastores/equipment-item/equipment-item-backend.type";
import type { EquipmentGetResponse } from "$datastores/equipment/equipment-backend.type";
import type { ReservationGetResponse } from "$datastores/reservation/reservation-backend.type";
import type { UserGetResponse } from "$datastores/user/user-backend.type";
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
  data_requested?: boolean;
  data_received?: boolean;
  data_request_description?: string;
  data_request_date?: Date;
  rating?: number;
  comment?: string;
  admin_note?: string;
  created_at?: Date;
  updated_at?: Date;
  reservation?: ReservationGetResponse;
  equipment?: EquipmentGetResponse;
  equipment_item?: EquipmentItemGetResponse;
}
