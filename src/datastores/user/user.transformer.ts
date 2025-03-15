import { Roles } from "$core/auth/auth.type";
import type { UserGetResponseData } from "./user-backend.type";
import type { User } from "./user.type";

export class UserTransformer {
  static transform(requestUser: UserGetResponseData): User {
    return {
      id: requestUser.id,
      firstName: requestUser.first_name,
      lastName: requestUser.last_name,
      username: requestUser.username,
      email: requestUser.email,
      type: requestUser.type,
      role: requestUser.role as Roles,
      profilePictureUrl: "",
      createdAt: new Date(requestUser.created_at),
      updatedAt: new Date(requestUser.updated_at),
    };
  }
}