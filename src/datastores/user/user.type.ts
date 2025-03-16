import type { Roles } from "$core/auth/auth.type";

export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  type: string;
  role: Roles;
  profilePictureUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}