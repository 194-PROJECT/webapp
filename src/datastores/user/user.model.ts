export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  roles: string[];
  active: boolean;
  profilePictureUrl: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}