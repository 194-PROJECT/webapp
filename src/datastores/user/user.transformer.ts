import { Roles } from "$core/auth/auth.type";
import type { Response } from "$core/backend/response.type";
import type { UserGetResponseData } from "./user-backend.type";
import type { User } from "./user.type";

export class UserTransformer {
  static transform(data: UserGetResponseData): User {
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      username: data.username,
      email: data.email,
      type: data.type,
      role: data.role as Roles,
      profilePictureUrl: data.profile_picture_url,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  static transformGetResponse(
    response: Response<UserGetResponseData>
  ): Response<User> {
    return {
      ...response,
      data: UserTransformer.transform(response.data),
    };
  }

  static transformGetManyResponse(
    response: Response<UserGetResponseData[]>
  ): Response<User[]> {
    return {
      ...response,
      data: response.data.map((data) => UserTransformer.transform(data)),
    };
  }
}