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
import type { Group } from './group.type';
import type { Response } from '$core/backend/response.type';
import type { GroupGetResponse } from './group-backend.type';
import { GroupTransformer } from './group.transformer';

export class GroupBackend implements Backend<Group> {
  public async fetch(id: number): Promise<Response<Group>> {
    const request: Requests<GetQuery>[RequestType.FETCH] = {
      route: `/group/${id}`,
      headers: new Headers(),
      parameters: { id },
    };

    let response = await HttpClient.request<GetQuery, GroupGetResponse>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(GroupTransformer.transformGetResponse(response));
  }

  public async fetch_many(query: GetManyQuery): Promise<Response<Group[]>> {
    const request: Requests<GetManyQuery>[RequestType.FETCH] = {
      route: `/group`,
      headers: new Headers(),
      parameters: query,
    };

    let response = await HttpClient.request<GetManyQuery, GroupGetResponse[]>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(GroupTransformer.transformGetManyResponse(response));
  }

  public async push(item: Group): Promise<Response<Group>> {
    const request: Requests<Group>[RequestType.PUSH] = {
      route: '/group',
      headers: new Headers(),
      body: item,
    };

    let response = await HttpClient.request<Group, GroupGetResponse>(
      request,
      RequestType.PUSH
    );
    return Promise.resolve(GroupTransformer.transformGetResponse(response));
  }

  public async update(id: number, item: Partial<Group>): Promise<Response<Group>> {
    const request: Requests<Partial<Group>>[RequestType.UPDATE] = {
      route: `/group/${id}`,
      headers: new Headers(),
      body: item,
    };

    let response = await HttpClient.request<Partial<Group>, GroupGetResponse>(
      request,
      RequestType.UPDATE
    );
    return Promise.resolve(GroupTransformer.transformGetResponse(response));
  }

  public async remove(id: number): Promise<Response<any>> {
    const request: Requests<DeleteQuery>[RequestType.REMOVE] = {
      route: `/group/${id}`,
      headers: new Headers(),
      parameters: { id },
    };

    return HttpClient.request<DeleteQuery, undefined>(request, RequestType.REMOVE);
  }

  public async remove_many(ids: number[]): Promise<Response<undefined>> {
    const request: Requests<DeleteManyQuery>[RequestType.REMOVE] = {
      route: `/group`,
      headers: new Headers(),
      parameters: { ids: ids },
    };

    return HttpClient.request<DeleteManyQuery, undefined>(request, RequestType.REMOVE);
  }
}
