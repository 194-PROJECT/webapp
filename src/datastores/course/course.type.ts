export interface Course {
  id: number;
  programId: number;
  name: string;
  description?: string;
  credits: number;
  createdAt?: Date;
  updatedAt?: Date;
}
