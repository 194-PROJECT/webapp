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
import type { EquipmentImage } from './equipment-image.type';
import type { Response } from '$core/backend/response.type';
import type { EquipmentImageGetResponse } from './equipment-image-backend.type';
import { EquipmentImageTransformer } from './equipment-image-transformer';

export class EquipmentImageBackend implements Backend<EquipmentImage> {
	public async fetch(id: number): Promise<Response<EquipmentImage>> {
		const request: Requests<GetQuery>[RequestType.FETCH] = {
			route: `/equipment/${id}/image`,
			headers: new Headers(),
			parameters: { id }
		};

		let response = await HttpClient.request<GetQuery, EquipmentImageGetResponse>(request, RequestType.FETCH);
		return Promise.resolve(EquipmentImageTransformer.transformGetResponse(response));
	}

	public async fetch_many(query: GetManyQuery): Promise<Response<EquipmentImage[]>> {
    if (!query.ids || query.ids.length !== 1) {
      throw new Error('Query must contain the equipment id.');
    }

		const request: Requests<GetManyQuery>[RequestType.FETCH] = {
			route: `/equipment/${query.ids[0]}/image`,
			headers: new Headers(),
			parameters: query
		};

		let response = await HttpClient.request<GetManyQuery, EquipmentImageGetResponse[]>(request, RequestType.FETCH);
		return Promise.resolve(EquipmentImageTransformer.transformGetManyResponse(response));
	}

	public async push(item: EquipmentImage): Promise<Response<EquipmentImage>> {
		const request: Requests<EquipmentImage>[RequestType.PUSH] = {
			route: '/equipment-image',
			headers: new Headers(),
			body: item
		};

		let response = await HttpClient.request<EquipmentImage, EquipmentImageGetResponse>(request, RequestType.PUSH);
		return Promise.resolve(EquipmentImageTransformer.transformGetResponse(response));
	}

	public async update(id: number, item: Partial<EquipmentImage>): Promise<Response<EquipmentImage>> {
		const request: Requests<Partial<EquipmentImage>>[RequestType.UPDATE] = {
			route: `/equipment-image/${id}`,
			headers: new Headers(),
			body: item
		};

		let response = await HttpClient.request<Partial<EquipmentImage>, EquipmentImageGetResponse>(request, RequestType.UPDATE);
		return Promise.resolve(EquipmentImageTransformer.transformGetResponse(response));
	}

	public async remove(id: number): Promise<Response<any>> {
		const request: Requests<DeleteQuery>[RequestType.REMOVE] = {
			route: `/equipment-image/${id}`,
			headers: new Headers(),
			parameters: { id }
		};

		return HttpClient.request<DeleteQuery, undefined>(request, RequestType.REMOVE);
	}

	public async remove_many(ids: number[]): Promise<Response<undefined>> {
		const request: Requests<DeleteManyQuery>[RequestType.REMOVE] = {
			route: `/equipment-image`,
			headers: new Headers(),
			parameters: { ids: ids }
		};

		return HttpClient.request<DeleteManyQuery, undefined>(request, RequestType.REMOVE);
	}
}
