import type { Backend } from "$core/backend/backend.type";
import type {
  DeleteManyQuery,
  DeleteQuery,
  GetManyQuery,
  GetQuery,
  Requests,
} from "$core/backend/request.type";
import { RequestType } from "$core/backend/request.type";
import { HttpClient } from "$core/protocols/http-client";
import type { EquipmentItem } from "./equipment-item.type";
import type { Response } from "$core/backend/response.type";
import { EquipmentItemTransformer } from "./equipment-item.transformer";
import type { EquipmentItemGetResponse } from "./equipment-item-backend.type";

export class EquipmentItemBackend implements Backend<EquipmentItem> {
  public async fetch(id: number): Promise<Response<EquipmentItem>> {
    const request: Requests<GetQuery>[RequestType.FETCH] = {
      route: `/equipment/item/${id}`,
      headers: new Headers(),
      parameters: { id },
    };

    let response = await HttpClient.request<GetQuery, EquipmentItemGetResponse>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(EquipmentItemTransformer.transformGetResponse(response));
  }

  public async fetch_many(query: GetManyQuery): Promise<Response<EquipmentItem[]>> {
    const request: Requests<GetManyQuery>[RequestType.FETCH] = {
      route: `/equipment/item`,
      headers: new Headers(),
      parameters: query,
    };

    if (query.ids && query.ids.length > 0) {
      request.route = `/equipment/${query.ids[0]}/item`;
    }

    let response = await HttpClient.request<GetManyQuery, EquipmentItemGetResponse[]>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(EquipmentItemTransformer.transformGetManyResponse(response));
  }

  public async push(item: EquipmentItem): Promise<Response<EquipmentItem>> {
    const request: Requests<EquipmentItem>[RequestType.PUSH] = {
      route: '/equipment/item',
      headers: new Headers(),
      body: item,
    };

    let response = await HttpClient.request<EquipmentItem, EquipmentItemGetResponse>(
      request,
      RequestType.PUSH
    );
    return Promise.resolve(EquipmentItemTransformer.transformGetResponse(response));
  }

  public async update(id: number, item: Partial<EquipmentItem>): Promise<Response<EquipmentItem>> {
    const request: Requests<Partial<EquipmentItem>>[RequestType.UPDATE] = {
      route: `/equipment/item/${id}`,
      headers: new Headers(),
      body: item,
    };

    let response = await HttpClient.request<Partial<EquipmentItem>, EquipmentItemGetResponse>(
      request,
      RequestType.UPDATE
    );
    return Promise.resolve(EquipmentItemTransformer.transformGetResponse(response));
  }

  public async remove(id: number): Promise<Response<any>> {
    const request: Requests<DeleteQuery>[RequestType.REMOVE] = {
      route: `/equipment/item/${id}`,
      headers: new Headers(),
      parameters: { id },
    };

    return HttpClient.request<DeleteQuery, undefined>(request, RequestType.REMOVE);
  }

  public async remove_many(ids: number[]): Promise<Response<undefined>> {
    const request: Requests<DeleteManyQuery>[RequestType.REMOVE] = {
      route: `/equipment/item`,
      headers: new Headers(),
      parameters: { ids: ids },
    };

    return HttpClient.request<DeleteManyQuery, undefined>(request, RequestType.REMOVE);
  }
}
