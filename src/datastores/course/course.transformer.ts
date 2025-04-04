import type { Response } from '$core/backend/response.type';
import type { CourseGetResponse } from './course-backend.type';
import type { Course } from './course.type';

export class CourseTransformer {
  static transform(data: CourseGetResponse): Course {
    return {
      id: data.id,
      programId: data.program_id,
      prerequisiteId: data.prerequisite_id,
      name: data.name,
      description: data.description,
      credits: data.credits,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    };
  }

  static transformGetResponse(response: Response<CourseGetResponse>): Response<Course> {
    return {
      ...response,
      data: response.data ? CourseTransformer.transform(response.data) : undefined,
    };
  }

  static transformGetManyResponse(response: Response<CourseGetResponse[]>): Response<Course[]> {
    return {
      ...response,
      data: response.data?.map((data) => CourseTransformer.transform(data)),
    };
  }
}
