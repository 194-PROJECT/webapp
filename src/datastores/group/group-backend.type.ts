import type { GroupUserGetResponse } from "$datastores/group-user/group-user-backend.type";

export interface GroupGetResponse {
  id: number;
  class_id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  users: GroupUserGetResponse[];
}
