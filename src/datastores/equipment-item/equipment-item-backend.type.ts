export interface EquipmentItemGetResponse {
  id: number;
  item_code: string;
  equipment_id: number;
  available: boolean;
  created_at?: Date;
  updated_at?: Date;
}
