import type { User } from "$datastores/user/user.type";

export interface Student {
  id: number;
  userId: number;
  programId: number;
  studentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type StudentUser = Student & User;