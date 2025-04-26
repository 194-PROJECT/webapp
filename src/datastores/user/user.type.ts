import type { UserRole, UserType } from "$core/auth/auth.type";

export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password?: string;
  type: UserType;
  role: UserRole;
  phoneNumber?: string;
  profilePictureUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
