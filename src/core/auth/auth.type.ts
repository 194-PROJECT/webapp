import type { UserGetResponseData } from "$datastores/user/user-backend.type";
import type { User } from "$datastores/user/user.type";
import type { SessionGetResponseData } from "./auth-backend.type";

export enum Permissions {
  READ = "read",
  WRITE = "write",
  DELETE = "delete",
  UPDATE = "update",
  CREATE = "create",
  UPLOAD = "upload",
  DOWNLOAD = "download",
}

export enum Roles {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest",
}

export interface Preferences {
  theme?: string;
  language?: string;
  timezone?: string;
  dateFormat?: string;
  timeFormat?: string;
  currency?: string;
  locale?: string;
  notifications?: boolean;
}

export interface Session {
  id: number;
  userId: number;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
  lastActiveAt: Date;
  isActive: boolean;
  deviceId?: string;
  location?: string;
}

/**
 * NOTE: This is an essential model for the user data which is heavily used in the authentication flow
 * 
 * @see $core/auth/auth.service.ts
 * @see $app.d.ts
 */
export type UserAuth = User;

export type UserContext = {
  user: UserAuth;
  session: Session;
};

export type UserContextGetResponse = {
  user: UserGetResponseData;
  session: SessionGetResponseData;
};