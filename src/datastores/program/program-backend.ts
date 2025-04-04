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
import type { Program } from './program.type';
import type { Response } from '$core/backend/response.type';
import type { ProgramGetResponse } from './program-backend.type';
import { ProgramTransformer } from './program.transformer';

export class ProgramBackend implements Backend<Program> {
  public async fetch(id: number): Promise<Response<Program>> {
    const request: Requests<GetQuery>[RequestType.FETCH] = {
      route: `/program/${id}`,
      headers: new Headers(),
      parameters: { id },
    };

    let response = await HttpClient.request<GetQuery, ProgramGetResponse>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(ProgramTransformer.transformGetResponse(response));
  }

  public async fetch_many(query: GetManyQuery): Promise<Response<Program[]>> {
    const request: Requests<GetManyQuery>[RequestType.FETCH] = {
      route: `/program`,
      headers: new Headers(),
      parameters: query,
    };

    let response = await HttpClient.request<GetManyQuery, ProgramGetResponse[]>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(ProgramTransformer.transformGetManyResponse(response));
  }

  public async push(item: Program): Promise<Response<Program>> {
    const request: Requests<Program>[RequestType.PUSH] = {
      route: '/program',
      headers: new Headers(),
      body: item,
    };

    let response = await HttpClient.request<Program, ProgramGetResponse>(
      request,
      RequestType.PUSH
    );
    return Promise.resolve(ProgramTransformer.transformGetResponse(response));
  }

  public async update(id: number, item: Partial<Program>): Promise<Response<Program>> {
    const request: Requests<Partial<Program>>[RequestType.UPDATE] = {
      route: `/program/${id}`,
      headers: new Headers(),
      body: item,
    };

    let response = await HttpClient.request<Partial<Program>, ProgramGetResponse>(
      request,
      RequestType.UPDATE
    );
    return Promise.resolve(ProgramTransformer.transformGetResponse(response));
  }

  public async remove(id: number): Promise<Response<any>> {
    const request: Requests<DeleteQuery>[RequestType.REMOVE] = {
      route: `/program/${id}`,
      headers: new Headers(),
      parameters: { id },
    };

    return HttpClient.request<DeleteQuery, undefined>(request, RequestType.REMOVE);
  }

  public async remove_many(ids: number[]): Promise<Response<undefined>> {
    const request: Requests<DeleteManyQuery>[RequestType.REMOVE] = {
      route: `/program`,
      headers: new Headers(),
      parameters: { ids: ids },
    };

    return HttpClient.request<DeleteManyQuery, undefined>(request, RequestType.REMOVE);
  }
}
