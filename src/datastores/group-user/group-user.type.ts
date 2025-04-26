import type { User } from "$datastores/user/user.type";

export interface GroupUser {
  id: number;
  groupId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}
