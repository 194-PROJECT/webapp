import type { UserGetResponse } from "$datastores/user/user-backend.type";

export interface GroupUserGetResponse {
  id: number;
  group_id: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  user?: UserGetResponse;
}
