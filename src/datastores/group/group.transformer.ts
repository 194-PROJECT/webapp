import type { Response } from '$core/backend/response.type';
import type { Class } from '$datastores/class/class.type';
import type { GroupGetResponse } from './group-backend.type';
import type { Group } from './group.type';

export class GroupTransformer {
  static transform(data: GroupGetResponse): Group {
    return {
      id: data.id,
      classId: data.class_id,
      name: data.name,
      description: data.description,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  static transformGetResponse(response: Response<GroupGetResponse>): Response<Group> {
    return {
      ...response,
      data: response.data ? GroupTransformer.transform(response.data) : undefined,
    };
  }

  static transformGetManyResponse(response: Response<GroupGetResponse[]>): Response<Group[]> {
    return {
      ...response,
      data: response.data?.map((data) => GroupTransformer.transform(data)),
    };
  }
}
