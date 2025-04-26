import type { GroupUser } from "$datastores/group-user/group-user.type";

export interface Group {
  id: number;
  classId?: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  users?: GroupUser[];
}
