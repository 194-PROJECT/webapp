export interface EquipmentGetResponse {
  id?: number;
  name: string;
  description?: string;
  category?: string;
  purchase_date: Date;
  price: number;
  created_at?: Date;
  updated_at?: Date;
}
