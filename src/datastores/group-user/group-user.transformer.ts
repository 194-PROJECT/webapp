import type { Response } from '$core/backend/response.type';
import type { GroupUserGetResponse } from './group-user-backend.type';
import type { GroupUser } from './group-user.type';

export class GroupUserTransformer {
  static transform(data: GroupUserGetResponse): GroupUser {
    return {
      id: data.id,
      groupId: data.group_id,
      userId: data.user_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  static transformGetResponse(response: Response<GroupUserGetResponse>): Response<GroupUser> {
    return {
      ...response,
      data: response.data ? GroupUserTransformer.transform(response.data) : undefined,
    };
  }

  static transformGetManyResponse(
    response: Response<GroupUserGetResponse[]>
  ): Response<GroupUser[]> {
    return {
      ...response,
      data: response.data?.map((data) => GroupUserTransformer.transform(data)),
    };
  }
}
