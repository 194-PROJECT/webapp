import { UserType, UserRole } from "$core/auth/auth.type";
import type { Response } from "$core/backend/response.type";
import type { UserGetResponse } from "./user-backend.type";
import type { User } from "./user.type";

export class UserTransformer {
  static transform(data: UserGetResponse): User {
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      username: data.username,
      email: data.email,
      type: data.type as UserType,
      role: data.role as UserRole,
      profilePictureUrl: data.profile_picture_url,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  static transformGetResponse(
    response: Response<UserGetResponse>
  ): Response<User> {
    return {
      ...response,
      data: response.data ? UserTransformer.transform(response.data) : undefined,
    };
  }

  static transformGetManyResponse(
    response: Response<UserGetResponse[]>
  ): Response<User[]> {
    return {
      ...response,
      data: response.data?.map((data) => UserTransformer.transform(data)),
    };
  }
}
