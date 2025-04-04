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
import type { Equipment } from './equipment.type';
import type { Response } from '$core/backend/response.type';
import type { EquipmentGetResponse } from './equipment-backend.type';
import { EquipmentTransformer } from './equipment.transformer';

export class EquipmentBackend implements Backend<Equipment> {
	public async fetch(id: number): Promise<Response<Equipment>> {
		const request: Requests<GetQuery>[RequestType.FETCH] = {
			route: `/equipment/${id}`,
			headers: new Headers(),
			parameters: { id }
		};

		let response = await HttpClient.request<GetQuery, EquipmentGetResponse>(request, RequestType.FETCH);
		return Promise.resolve(EquipmentTransformer.transformGetResponse(response));
	}

	public async fetch_many(query: GetManyQuery): Promise<Response<Equipment[]>> {
		const request: Requests<GetManyQuery>[RequestType.FETCH] = {
			route: `/equipment`,
			headers: new Headers(),
			parameters: query
		};

		let response = await HttpClient.request<GetManyQuery, EquipmentGetResponse[]>(request, RequestType.FETCH);
		return Promise.resolve(EquipmentTransformer.transformGetManyResponse(response));
	}

	public async push(item: Equipment): Promise<Response<Equipment>> {
		const request: Requests<Equipment>[RequestType.PUSH] = {
			route: '/equipment',
			headers: new Headers(),
			body: item
		};

		let response = await HttpClient.request<Equipment, EquipmentGetResponse>(request, RequestType.PUSH);
		return Promise.resolve(EquipmentTransformer.transformGetResponse(response));
	}

	public async update(id: number, item: Partial<Equipment>): Promise<Response<Equipment>> {
		const request: Requests<Partial<Equipment>>[RequestType.UPDATE] = {
			route: `/equipment/${id}`,
			headers: new Headers(),
			body: item
		};

		let response = await HttpClient.request<Partial<Equipment>, EquipmentGetResponse>(request, RequestType.UPDATE);
		return Promise.resolve(EquipmentTransformer.transformGetResponse(response));
	}

	public async remove(id: number): Promise<Response<any>> {
		const request: Requests<DeleteQuery>[RequestType.REMOVE] = {
			route: `/equipment/${id}`,
			headers: new Headers(),
			parameters: { id }
		};

		return HttpClient.request<DeleteQuery, undefined>(request, RequestType.REMOVE);
	}

	public async remove_many(ids: number[]): Promise<Response<undefined>> {
		const request: Requests<DeleteManyQuery>[RequestType.REMOVE] = {
			route: `/equipment`,
			headers: new Headers(),
			parameters: { ids: ids }
		};

		return HttpClient.request<DeleteManyQuery, undefined>(request, RequestType.REMOVE);
	}
}
