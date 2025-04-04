export interface Class {
  id: number;
  courseId: number;
  instructorId: number;
  semesterId: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
