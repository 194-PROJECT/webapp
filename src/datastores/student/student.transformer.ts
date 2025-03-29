import type { Response } from "$core/backend/response.type";
import { UserTransformer } from "$datastores/user/user.transformer";
import type { User } from "$datastores/user/user.type";
import type { StudentGetResponse } from "./student-backend.type";
import type { Student, StudentUser } from "./student.type";

export class StudentTransformer {
  static transform(data: StudentGetResponse): Student {
    return {
      id: data.id,
      userId: data.user_id,
      programId: data.program_id,
      studentId: data.student_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  static transformGetResponse(
    response: Response<StudentGetResponse>
  ): Response<Student> {
    return {
      ...response,
      data: response.data ? StudentTransformer.transform(response.data) : undefined,
    };
  }

  static transformGetManyResponse(
    response: Response<StudentGetResponse[]>
  ): Response<Student[]> {
    return {
      ...response,
      data: response.data?.map((data) => StudentTransformer.transform(data)),
    };
  }

  static transformStudentUser(
    studentData: Student,
    userData: User,
  ): StudentUser {
    return {
      ...studentData,
      ...userData,
      id: studentData.id,
      createdAt: studentData.createdAt,
      updatedAt: studentData.updatedAt,
    };
  }

  static transformStudentUsers(
    studentData: Student[],
    userData: User[],
  ): StudentUser[] {
    return studentData.map((student) => {
      const user = userData.find((user) => user.id === student.userId);
      return this.transformStudentUser(student, user!);
    });
  };
}
