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
import type { Reservation } from './reservation.type';
import type { Response } from '$core/backend/response.type';
import type { ReservationGetResponse } from './reservation-backend.type';
import { ReservationTransformer } from './reservation.transformer';

export class ReservationBackend implements Backend<Reservation> {
  public async fetch(id: number): Promise<Response<Reservation>> {
    const request: Requests<GetQuery>[RequestType.FETCH] = {
      route: `/reservation/${id}`,
      headers: new Headers(),
      parameters: { id },
    };

    let response = await HttpClient.request<GetQuery, ReservationGetResponse>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(ReservationTransformer.transformGetResponse(response));
  }

  public async fetch_many(query: GetManyQuery): Promise<Response<Reservation[]>> {
    const request: Requests<GetManyQuery>[RequestType.FETCH] = {
      route: `/reservation`,
      headers: new Headers(),
      parameters: query,
    };

    let response = await HttpClient.request<GetManyQuery, ReservationGetResponse[]>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(ReservationTransformer.transformGetManyResponse(response));
  }

  public async push(item: Reservation): Promise<Response<Reservation>> {
    const request: Requests<Reservation>[RequestType.PUSH] = {
      route: '/reservation',
      headers: new Headers(),
      body: item,
    };

    let response = await HttpClient.request<Reservation, ReservationGetResponse>(
      request,
      RequestType.PUSH
    );
    return Promise.resolve(ReservationTransformer.transformGetResponse(response));
  }

  public async update(id: number, item: Partial<Reservation>): Promise<Response<Reservation>> {
    const request: Requests<Partial<Reservation>>[RequestType.UPDATE] = {
      route: `/reservation/${id}`,
      headers: new Headers(),
      body: item,
    };

    let response = await HttpClient.request<Partial<Reservation>, ReservationGetResponse>(
      request,
      RequestType.UPDATE
    );
    return Promise.resolve(ReservationTransformer.transformGetResponse(response));
  }

  public async remove(id: number): Promise<Response<any>> {
    const request: Requests<DeleteQuery>[RequestType.REMOVE] = {
      route: `/reservation/${id}`,
      headers: new Headers(),
      parameters: { id },
    };

    return HttpClient.request<DeleteQuery, undefined>(request, RequestType.REMOVE);
  }

  public async remove_many(ids: number[]): Promise<Response<undefined>> {
    const request: Requests<DeleteManyQuery>[RequestType.REMOVE] = {
      route: `/reservation`,
      headers: new Headers(),
      parameters: { ids: ids },
    };

    return HttpClient.request<DeleteManyQuery, undefined>(request, RequestType.REMOVE);
  }
}
