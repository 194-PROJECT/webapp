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
import type { Department } from './department.type';
import type { Response } from '$core/backend/response.type';
import type { DepartmentGetResponse } from './department-backend.type';
import { DepartmentTransformer } from './department.transformer';

export class DepartmentBackend implements Backend<Department> {
  public async fetch(id: number): Promise<Response<Department>> {
    const request: Requests<GetQuery>[RequestType.FETCH] = {
      route: `/department/${id}`,
      headers: new Headers(),
      parameters: { id },
    };

    let response = await HttpClient.request<GetQuery, DepartmentGetResponse>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(DepartmentTransformer.transformGetResponse(response));
  }

  public async fetch_many(query: GetManyQuery): Promise<Response<Department[]>> {
    const request: Requests<GetManyQuery>[RequestType.FETCH] = {
      route: `/department`,
      headers: new Headers(),
      parameters: query,
    };

    let response = await HttpClient.request<GetManyQuery, DepartmentGetResponse[]>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(DepartmentTransformer.transformGetManyResponse(response));
  }

  public async push(item: Department): Promise<Response<Department>> {
    const request: Requests<Department>[RequestType.PUSH] = {
      route: '/department',
      headers: new Headers(),
      body: item,
    };

    let response = await HttpClient.request<Department, DepartmentGetResponse>(
      request,
      RequestType.PUSH
    );
    return Promise.resolve(DepartmentTransformer.transformGetResponse(response));
  }

  public async update(id: number, item: Partial<Department>): Promise<Response<Department>> {
    const request: Requests<Partial<Department>>[RequestType.UPDATE] = {
      route: `/department/${id}`,
      headers: new Headers(),
      body: item,
    };

    let response = await HttpClient.request<Partial<Department>, DepartmentGetResponse>(
      request,
      RequestType.UPDATE
    );
    return Promise.resolve(DepartmentTransformer.transformGetResponse(response));
  }

  public async remove(id: number): Promise<Response<any>> {
    const request: Requests<DeleteQuery>[RequestType.REMOVE] = {
      route: `/department/${id}`,
      headers: new Headers(),
      parameters: { id },
    };

    return HttpClient.request<DeleteQuery, undefined>(request, RequestType.REMOVE);
  }

  public async remove_many(ids: number[]): Promise<Response<undefined>> {
    const request: Requests<DeleteManyQuery>[RequestType.REMOVE] = {
      route: `/department`,
      headers: new Headers(),
      parameters: { ids: ids },
    };

    return HttpClient.request<DeleteManyQuery, undefined>(request, RequestType.REMOVE);
  }
}
