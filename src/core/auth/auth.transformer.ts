import type { SessionGetResponseData } from "./auth-backend.type";
import type { Session } from "./auth.type";

export class SessionTransformer {
  static transform(requestUser: SessionGetResponseData): Session {
    return {
      id: requestUser.id,
      userId: requestUser.user_id,
      token: requestUser.token,
      ipAddress: requestUser.ip_address,
      userAgent: requestUser.user_agent,
      createdAt: requestUser.created_at,
      expiresAt: requestUser.expires_at,
      lastActiveAt: requestUser.last_active_at,
      isActive: requestUser.is_active,
      deviceId: requestUser.device_id,
      location: requestUser.location
    };
  }
}
