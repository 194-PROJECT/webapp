import type { Backend } from '$core/backend/backend.type';
import type {
  DeleteManyQuery,
  DeleteQuery,
  GetManyQuery,
  GetQuery,
  Requests,
} from '$core/backend/request.type';
import { RequestType } from '$core/backend/request.type';
import { HttpClient } from '$core/protocols/http-client';
import type { GroupUser } from './group-user.type';
import type { Response } from '$core/backend/response.type';
import type { GroupUserGetResponse } from './group-user-backend.type';
import { GroupUserTransformer } from './group-user.transformer';

export class GroupUserBackend implements Backend<GroupUser> {
  public async fetch(id: number): Promise<Response<GroupUser>> {
    const request: Requests<GetQuery>[RequestType.FETCH] = {
      route: `/group/user/${id}`,
      headers: new Headers(),
      parameters: { id },
    };

    let response = await HttpClient.request<GetQuery, GroupUserGetResponse>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(GroupUserTransformer.transformGetResponse(response));
  }

  public async fetch_many(query: GetManyQuery): Promise<Response<GroupUser[]>> {
    if (!query.ids || !query.ids[0]) {
      throw new Error('ids parameter is required for fetching multiple group users.');
    }

    const request: Requests<GetManyQuery>[RequestType.FETCH] = {
      route: `/group/${query.ids[0]}/user`,
      headers: new Headers(),
      parameters: query,
    };

    let response = await HttpClient.request<GetManyQuery, GroupUserGetResponse[]>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(GroupUserTransformer.transformGetManyResponse(response));
  }

  public async push(item: GroupUser): Promise<Response<GroupUser>> {
    const request: Requests<GroupUser>[RequestType.PUSH] = {
      route: `/group/user`,
      headers: new Headers(),
      body: item,
    };

    let response = await HttpClient.request<GroupUser, GroupUserGetResponse>(
      request,
      RequestType.PUSH
    );
    return Promise.resolve(GroupUserTransformer.transformGetResponse(response));
  }

  public async update(id: number, item: Partial<GroupUser>): Promise<Response<GroupUser>> {
    const request: Requests<Partial<GroupUser>>[RequestType.UPDATE] = {
      route: `/group/user/${id}`,
      headers: new Headers(),
      body: item,
    };

    let response = await HttpClient.request<Partial<GroupUser>, GroupUserGetResponse>(
      request,
      RequestType.UPDATE
    );
    return Promise.resolve(GroupUserTransformer.transformGetResponse(response));
  }

  public async remove(id: number): Promise<Response<any>> {
    const request: Requests<DeleteQuery>[RequestType.REMOVE] = {
      route: `/group/user/${id}`,
      headers: new Headers(),
      parameters: { id },
    };

    return HttpClient.request<DeleteQuery, undefined>(request, RequestType.REMOVE);
  }

  public async remove_many(ids: number[]): Promise<Response<undefined>> {
    const request: Requests<DeleteManyQuery>[RequestType.REMOVE] = {
      route: `/group/user`,
      headers: new Headers(),
      parameters: { ids: ids },
    };

    return HttpClient.request<DeleteManyQuery, undefined>(request, RequestType.REMOVE);
  }
}
