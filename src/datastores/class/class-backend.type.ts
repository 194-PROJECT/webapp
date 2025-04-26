import type { CourseGetResponse } from "$datastores/course/course-backend.type";

export interface ClassGetResponse {
  id: number;
  course_id: number;
  instructor_id: number;
  semester_id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  course?: CourseGetResponse;
}
