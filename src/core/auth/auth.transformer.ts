import type { SessionGetResponseData } from "./auth-backend.type";
import type { Session } from "./auth.type";

export class SessionTransformer {
  static transform(data: SessionGetResponseData): Session {
    return {
      id: data.id,
      userId: data.user_id,
      token: data.token,
      ipAddress: data.ip_address,
      userAgent: data.user_agent,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
      lastActiveAt: data.last_active_at,
      isActive: data.is_active,
      deviceId: data.device_id,
      location: data.location
    };
  }
}
