export interface ReservationEquipmentGetResponse {
  id?: number;
  reservation_id: number;
  equipment_id?: number;
  quantity: number;
  returned?: boolean;
  returned_quantity?: number;
  mishandled?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
