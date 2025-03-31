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
}
