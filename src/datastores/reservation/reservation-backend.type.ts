export interface ReservationGetResponse {
  id: number;
  user_id: number;
  admin_id?: number;
  group_id?: number;
  start_date: string;
  end_date: string;
  accepted: boolean;
  claimed: boolean;
  returned: boolean;
  reason: string;
  admin_note?: string;
  return_note?: string;
  return_date?: string;
  created_at?: string;
  updated_at?: string;
}
