import type { Backend } from '$core/backend/backend.type';
import type {
	GetManyQuery,
	GetQuery,
	Requests
} from '$core/backend/request.type';
import { RequestType } from '$core/backend/request.type';
import { HttpClient } from '$core/protocols/http-client';
import type { Response } from '$core/backend/response.type';
import type { Reservation } from '$datastores/reservation/reservation.type';
import type { ReservationGetResponse } from '$datastores/reservation/reservation-backend.type';
import { ReservationTransformer } from '$datastores/reservation/reservation.transformer';

export class EquipmentReservationBackend implements Backend<Reservation> {
  public async fetch_many(query: GetManyQuery): Promise<Response<Reservation[]>> {
    if (!query.ids || query.ids.length !== 1) {
      throw new Error('ids parameter is required for fetching multiple equipment related reservations');
    }

    const request: Requests<GetManyQuery>[RequestType.FETCH] = {
      route: `/equipment/${query.ids[0]}/reservation`,
      headers: new Headers(),
      parameters: query,
    };


    let response = await HttpClient.request<GetManyQuery, ReservationGetResponse[]>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(ReservationTransformer.transformGetManyResponse(response));
  }
}
