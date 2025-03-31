import type { User } from "$datastores/user/user.type";

export interface Reservation {
  id?: number;
  userId: number;
  adminId?: number;
  groupId?: number;
  startDate: Date;
  endDate: Date;
  accepted: boolean;
  returned: boolean;
  reason: string;
  adminNote?: string;
  returnNote?: string;
  returnDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ReservationUser = Reservation & User;