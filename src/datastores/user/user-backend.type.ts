import type { UserRole, UserType } from "$core/auth/auth.type";

export interface UserGetResponse {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password?: string;
  type: UserType;
  role: UserRole;
  profile_picture_url?: string;
  created_at: string;
  updated_at: string;
}
