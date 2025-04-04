import type { Backend } from '$core/backend/backend.type';
import type {
  DeleteManyQuery,
  DeleteQuery,
  GetManyQuery,
  GetQuery,
  Requests
} from '$core/backend/request.type';
import { RequestType } from '$core/backend/request.type';
import { HttpClient } from '$core/protocols/http-client';
import type { Semester } from './semester.type';
import type { Response } from '$core/backend/response.type';
import type { SemesterGetResponse } from './semester-backend.type';
import { SemesterTransformer } from './semester.transformer';

export class SemesterBackend implements Backend<Semester> {
  public async fetch(id: number): Promise<Response<Semester>> {
    const request: Requests<GetQuery>[RequestType.FETCH] = {
      route: `/semester/${id}`,
      headers: new Headers(),
      parameters: { id }
    };

    let response = await HttpClient.request<GetQuery, SemesterGetResponse>(request, RequestType.FETCH);
    return {
      ...response,
      data: response.data ? SemesterTransformer.transform(response.data) : undefined,
    };
  }

  public async fetch_many(query: GetManyQuery): Promise<Response<Semester[]>> {
    const request: Requests<GetManyQuery>[RequestType.FETCH] = {
      route: `/semester`,
      headers: new Headers(),
      parameters: query
    };

    let response = await HttpClient.request<GetManyQuery, SemesterGetResponse[]>(request, RequestType.FETCH);
    return {
      ...response,
      data: response.data?.map(SemesterTransformer.transform),
    };
  }

  public async push(item: Semester): Promise<Response<Semester>> {
    const request: Requests<Semester>[RequestType.PUSH] = {
      route: '/semester',
      headers: new Headers(),
      body: item
    };

    let response = await HttpClient.request<Semester, SemesterGetResponse>(request, RequestType.PUSH);
    return {
      ...response,
      data: response.data ? SemesterTransformer.transform(response.data) : undefined,
    };
  }

  public async update(id: number, item: Partial<Semester>): Promise<Response<Semester>> {
    const request: Requests<Partial<Semester>>[RequestType.UPDATE] = {
      route: `/semester/${id}`,
      headers: new Headers(),
      body: item
    };

    let response = await HttpClient.request<Partial<Semester>, SemesterGetResponse>(request, RequestType.UPDATE);
    return {
      ...response,
      data: response.data ? SemesterTransformer.transform(response.data) : undefined,
    };
  }

  public async remove(id: number): Promise<Response<any>> {
    const request: Requests<DeleteQuery>[RequestType.REMOVE] = {
      route: `/semester/${id}`,
      headers: new Headers(),
      parameters: { id }
    };

    return HttpClient.request<DeleteQuery, undefined>(request, RequestType.REMOVE);
  }

  public async remove_many(ids: number[]): Promise<Response<undefined>> {
    const request: Requests<DeleteManyQuery>[RequestType.REMOVE] = {
      route: `/semester`,
      headers: new Headers(),
      parameters: { ids: ids }
    };

    return HttpClient.request<DeleteManyQuery, undefined>(request, RequestType.REMOVE);
  }
}
