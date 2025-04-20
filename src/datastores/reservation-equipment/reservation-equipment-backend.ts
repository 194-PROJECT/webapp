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
import type { ReservationEquipment } from './reservation-equipment.type';
import type { Response } from '$core/backend/response.type';
import type { ReservationEquipmentGetResponse } from './reservation-equipment-backend.type';
import { ReservationEquipmentTransformer } from './reservation-equipment.transformer';

export class ReservationBackend implements Backend<ReservationEquipment> {
  public async fetch(id: number): Promise<Response<ReservationEquipment>> {
    const request: Requests<GetQuery>[RequestType.FETCH] = {
      route: `/reservation/equipment/${id}`,
      headers: new Headers(),
      parameters: { id },
    };

    let response = await HttpClient.request<GetQuery, ReservationEquipmentGetResponse>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(ReservationEquipmentTransformer.transformGetResponse(response));
  }

  public async fetch_many(query: GetManyQuery): Promise<Response<ReservationEquipment[]>> {
    let request: Requests<GetManyQuery>[RequestType.FETCH];

    if(query.ids && query.ids.length > 0) {
      let route: string;
      switch (query.projection) {
        // If containing a projection, treat the id as a user id
        case 'data-request':
          route = `/reservation/equipment/data-request/user/${query.ids[0]}`;
          break;
        case 'mishandle':
          route = `/reservation/equipment/mishandle/user/${query.ids[0]}`;
          break;
        default:
          route = `/reservation/${query.ids[0]}/equipment`;
          break;
      }
      request = {
        route: route,
        headers: new Headers(),
        parameters: query,
      };
    } else {
      let route: string;
      switch (query.projection) {
        // If containing a projection, treat the id as a user id
        case 'data-request':
          route = '/reservation/equipment/data-request';
          break;
        case 'mishandle':
          route = '/reservation/equipment/mishandle';
          break;
        default:
          route = '/reservation/equipment';
          break;
      };
      request = {
        route: route,
        headers: new Headers(),
        parameters: query,
      };
    }

    let response = await HttpClient.request<GetManyQuery, ReservationEquipmentGetResponse[]>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(ReservationEquipmentTransformer.transformGetManyResponse(response));
  }

  public async push(item: ReservationEquipment): Promise<Response<ReservationEquipment>> {
    const request: Requests<ReservationEquipment>[RequestType.PUSH] = {
      route: `/reservation/${item.reservationId}/equipment`,
      headers: new Headers(),
      body: item,
    };

    let response = await HttpClient.request<ReservationEquipment, ReservationEquipmentGetResponse>(
      request,
      RequestType.PUSH
    );
    return Promise.resolve(ReservationEquipmentTransformer.transformGetResponse(response));
  }

  public async update(id: number, item: Partial<ReservationEquipment>): Promise<Response<ReservationEquipment>> {
    const request: Requests<Partial<ReservationEquipment>>[RequestType.UPDATE] = {
      route: `/reservation/equipment/${id}`,
      headers: new Headers(),
      body: item,
    };

    let response = await HttpClient.request<Partial<ReservationEquipment>, ReservationEquipmentGetResponse>(
      request,
      RequestType.UPDATE
    );
    return Promise.resolve(ReservationEquipmentTransformer.transformGetResponse(response));
  }

  public async remove(id: number): Promise<Response<any>> {
    const request: Requests<DeleteQuery>[RequestType.REMOVE] = {
      route: `/reservation/equipment/${id}`,
      headers: new Headers(),
      parameters: { id },
    };

    return HttpClient.request<DeleteQuery, undefined>(request, RequestType.REMOVE);
  }

  public async remove_many(ids: number[]): Promise<Response<undefined>> {
    const request: Requests<DeleteManyQuery>[RequestType.REMOVE] = {
      route: `/reservation/equipment`,
      headers: new Headers(),
      parameters: { ids: ids },
    };

    return HttpClient.request<DeleteManyQuery, undefined>(request, RequestType.REMOVE);
  }
}
