import type { Course } from "$datastores/course/course.type";

export interface Class {
  id: number;
  courseId: number;
  instructorId: number;
  semesterId: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  course?: Course;
}
