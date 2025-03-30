import type { UserGetResponse } from "$datastores/user/user-backend.type";
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

export enum UserType {
  MANAGEMENT = "management",
  STUDENT = "student",
  FACULTY = "faculty",
  STAFF = "staff",
  ALUMNI = "alumni",
  GUEST = "guest",
}

export enum UserRole {
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
  user: UserGetResponse;
  session: SessionGetResponseData;
};

export const defaultRedirect: Record<UserRole, string> = {
  [UserRole.ADMIN]: '/admin',
  [UserRole.USER]: '/',
  [UserRole.GUEST]: '/',
};

export const userTypeToRoleMap: Record<UserType, UserRole> = {
  [UserType.MANAGEMENT]: UserRole.ADMIN,
  [UserType.FACULTY]: UserRole.ADMIN,
  [UserType.STAFF]: UserRole.ADMIN,
  [UserType.GUEST]: UserRole.GUEST,
  [UserType.STUDENT]: UserRole.USER,
  [UserType.ALUMNI]: UserRole.USER,
};