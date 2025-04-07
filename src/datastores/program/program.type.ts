export interface Program {
  id: number;
  departmentId: number;
  title: string;
  description?: string;
  creditsRequired: number;
  duration: number;
  createdAt?: Date;
  updatedAt?: Date;
}
