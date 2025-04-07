import type { Response } from '$core/backend/response.type';
import type { DepartmentGetResponse } from './department-backend.type';
import type { Department } from './department.type';

export class DepartmentTransformer {
  static transform(data: DepartmentGetResponse): Department {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  static transformGetResponse(response: Response<DepartmentGetResponse>): Response<Department> {
    return {
      ...response,
      data: response.data ? DepartmentTransformer.transform(response.data) : undefined,
    };
  }

  static transformGetManyResponse(
    response: Response<DepartmentGetResponse[]>
  ): Response<Department[]> {
    return {
      ...response,
      data: response.data?.map((data) => DepartmentTransformer.transform(data)),
    };
  }
}
