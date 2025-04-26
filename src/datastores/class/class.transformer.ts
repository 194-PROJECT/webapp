import type { Class } from './class.type';
import type { ClassGetResponse } from './class-backend.type';
import type { Response } from '$core/backend/response.type';
import { CourseTransformer } from '$datastores/course/course.transformer';

export class ClassTransformer {
  static transform(data: ClassGetResponse): Class {
    return {
      id: data.id,
      courseId: data.course_id,
      instructorId: data.instructor_id,
      semesterId: data.semester_id,
      name: data.name,
      description: data.description,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      course: data.course ? CourseTransformer.transform(data.course) : undefined,
    };
  }

  static transformGetResponse(response: Response<ClassGetResponse>): Response<Class> {
    return {
      ...response,
      data: response.data ? ClassTransformer.transform(response.data) : undefined,
    };
  }

  static transformGetManyResponse(response: Response<ClassGetResponse[]>): Response<Class[]> {
    return {
      ...response,
      data: response.data?.map((data) => ClassTransformer.transform(data)),
    };
  }
}
