export interface CourseGetResponse {
  id: number;
  program_id: number;
  prerequisite_id?: number;
  name: string;
  description?: string;
  credits: number;
  created_at?: string;
  updated_at?: string;
}
