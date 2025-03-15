export interface SessionGetResponseData {
  id: number;
  user_id: number;
  token: string;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
  expires_at: Date;
  last_active_at: Date;
  is_active: boolean;
  device_id?: string;
  location?: string;
}