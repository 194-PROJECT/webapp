import type { Response } from '$core/backend/response.type';
import type { ProgramGetResponse } from './program-backend.type';
import type { Program } from './program.type';

export class ProgramTransformer {
  static transform(data: ProgramGetResponse): Program {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      creditsRequired: data.credits_required,
      programDuration: data.program_duration,
      departmentId: data.department_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  static transformGetResponse(response: Response<ProgramGetResponse>): Response<Program> {
    return {
      ...response,
      data: response.data ? ProgramTransformer.transform(response.data) : undefined,
    };
  }

  static transformGetManyResponse(response: Response<ProgramGetResponse[]>): Response<Program[]> {
    return {
      ...response,
      data: response.data?.map((data) => ProgramTransformer.transform(data)),
    };
  }
}
