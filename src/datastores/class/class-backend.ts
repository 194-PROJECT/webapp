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
import type { Class } from './class.type';
import type { Response } from '$core/backend/response.type';
import type { ClassGetResponse } from './class-backend.type';
import { ClassTransformer } from './class.transformer';

export class ClassBackend implements Backend<Class> {
  public async fetch(id: number): Promise<Response<Class>> {
    const request: Requests<GetQuery>[RequestType.FETCH] = {
      route: `/class/${id}`,
      headers: new Headers(),
      parameters: { id },
    };

    let response = await HttpClient.request<GetQuery, ClassGetResponse>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(ClassTransformer.transformGetResponse(response));
  }

  public async fetch_many(query: GetManyQuery): Promise<Response<Class[]>> {
    let route: string;
    switch (query.projection) {
      case 'current-semester':
        route = `/class/current-semester`;
        break;
      default:
        route = '/class';
        break;
    };
  
    const request: Requests<GetManyQuery>[RequestType.FETCH] = {
      route: route,
      headers: new Headers(),
      parameters: query,
    };

    let response = await HttpClient.request<GetManyQuery, ClassGetResponse[]>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(ClassTransformer.transformGetManyResponse(response));
  }

  public async push(item: Class): Promise<Response<Class>> {
    const request: Requests<Class>[RequestType.PUSH] = {
      route: '/class',
      headers: new Headers(),
      body: item,
    };

    let response = await HttpClient.request<Class, ClassGetResponse>(
      request,
      RequestType.PUSH
    );
    return Promise.resolve(ClassTransformer.transformGetResponse(response));
  }

  public async update(id: number, item: Partial<Class>): Promise<Response<Class>> {
    const request: Requests<Partial<Class>>[RequestType.UPDATE] = {
      route: `/class/${id}`,
      headers: new Headers(),
      body: item,
    };

    let response = await HttpClient.request<Partial<Class>, ClassGetResponse>(
      request,
      RequestType.UPDATE
    );
    return Promise.resolve(ClassTransformer.transformGetResponse(response));
  }

  public async remove(id: number): Promise<Response<any>> {
    const request: Requests<DeleteQuery>[RequestType.REMOVE] = {
      route: `/class/${id}`,
      headers: new Headers(),
      parameters: { id },
    };

    return HttpClient.request<DeleteQuery, undefined>(request, RequestType.REMOVE);
  }

  public async remove_many(ids: number[]): Promise<Response<undefined>> {
    const request: Requests<DeleteManyQuery>[RequestType.REMOVE] = {
      route: `/class`,
      headers: new Headers(),
      parameters: { ids: ids },
    };

    return HttpClient.request<DeleteManyQuery, undefined>(request, RequestType.REMOVE);
  }
}
