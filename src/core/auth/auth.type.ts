import type { User } from "$datastores/user/user.model";

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
  sessionId: number;
  userId: number;
  username: string;
  expires: Date;
  token: string;
  csrfToken: string;
  roles: Roles[];
  lastPage?: string;
  permissions?: Permissions[];
  preferences?: Preferences;
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