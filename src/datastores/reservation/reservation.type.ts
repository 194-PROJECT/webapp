import type { Class } from "$datastores/class/class.type";
import type { Group } from "$datastores/group/group.type";
import type { User } from "$datastores/user/user.type";

export interface Reservation {
  id: number;
  userId: number;
  adminId?: number;
  classId?: number;
  groupId?: number;
  startDate: Date;
  endDate: Date;
  accepted?: boolean;
  claimed?: boolean;
  returned?: boolean;
  reason: string;
  adminNote?: string;
  returnNote?: string;
  returnDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  user?: User;
  admin?: User;
  class?: Class;
  group?: Group;
}

export type ReservationUser = Reservation & User;