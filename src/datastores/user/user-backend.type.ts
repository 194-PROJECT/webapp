export interface UserGetResponseData {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password?: string;
  type: string;
  role: string;
  profile_picture_url?: string;
  created_at: string;
  updated_at: string;
}
