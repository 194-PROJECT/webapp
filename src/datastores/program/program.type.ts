export interface Program {
  id: number;
  departmentId: number;
  title: string;
  description?: string;
  creditsRequired: number;
  programDuration: number;
  createdAt?: Date;
  updatedAt?: Date;
}
