export interface ProgramGetResponse {
  id: number;
  department_id: number;
  title: string;
  description?: string;
  credits_required: number;
  program_duration: number;
  created_at: string;
  updated_at: string;
}
