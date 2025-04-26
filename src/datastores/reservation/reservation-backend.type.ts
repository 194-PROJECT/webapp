import type { ClassGetResponse } from "$datastores/class/class-backend.type";
import type { GroupGetResponse } from "$datastores/group/group-backend.type";
import type { UserGetResponse } from "$datastores/user/user-backend.type";

export interface ReservationGetResponse {
  id: number;
  user_id: number;
  admin_id?: number;
  class_id?: number;
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
  user?: UserGetResponse;
  admin?: UserGetResponse;
  class_?: ClassGetResponse;
  group?: GroupGetResponse;
}
