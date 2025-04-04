import type { Response } from "$core/backend/response.type";
import type { SemesterGetResponse } from './semester-backend.type';
import type { Semester } from './semester.type';

export class SemesterTransformer {
  static transform(data: SemesterGetResponse): Semester {
    return {
      id: data.id,
      name: data.name,
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  static transformGetResponse(
    response: Response<SemesterGetResponse>
  ): Response<Semester> {
    return {
      ...response,
      data: response.data ? SemesterTransformer.transform(response.data) : undefined,
    };
  }

  static transformGetManyResponse(
    response: Response<SemesterGetResponse[]>
  ): Response<Semester[]> {
    return {
      ...response,
      data: response.data?.map(SemesterTransformer.transform),
    };
  }
}
