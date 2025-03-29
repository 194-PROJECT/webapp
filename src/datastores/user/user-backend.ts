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
import type { User } from './user.type';
import type { Response } from '$core/backend/response.type';
import type { UserGetResponse } from './user-backend.type';
import { UserTransformer } from './user.transformer';

export class UserBackend implements Backend<User> {
	public async fetch(id: number): Promise<Response<User>> {
		const request: Requests<GetQuery>[RequestType.FETCH] = {
			route: `/user/${id}`,
			headers: new Headers(),
			parameters: { id }
		};

    let response = await HttpClient.request<GetQuery, UserGetResponse>(request, RequestType.FETCH);
    return Promise.resolve(UserTransformer.transformGetResponse(response));
	}

	public async fetch_many(query: GetManyQuery): Promise<Response<User[]>> {
		const request: Requests<GetManyQuery>[RequestType.FETCH] = {
			route: `/user`,
			headers: new Headers(),
			parameters: query
		};

    let response = await HttpClient.request<GetManyQuery, UserGetResponse[]>(request, RequestType.FETCH);
    return Promise.resolve(UserTransformer.transformGetManyResponse(response));
	}

	public async push(item: User): Promise<Response<User>> {
		const request: Requests<User>[RequestType.PUSH] = {
			route: '/user',
			headers: new Headers(),
			body: item
		};

    let response = await HttpClient.request<User, UserGetResponse>(request, RequestType.PUSH);
    return Promise.resolve(UserTransformer.transformGetResponse(response));
	}

	public async update(id: number, item: Partial<User>): Promise<Response<User>> {
		const request: Requests<Partial<User>>[RequestType.UPDATE] = {
			route: `/user/${id}`,
			headers: new Headers(),
			body: item
		};

    let response = await HttpClient.request<Partial<User>, UserGetResponse>(request, RequestType.UPDATE);
    return Promise.resolve(UserTransformer.transformGetResponse(response));
	}

	public async remove(id: number): Promise<Response<any>> {
		const request: Requests<DeleteQuery>[RequestType.REMOVE] = {
			route: `/user/${id}`,
			headers: new Headers(),
			parameters: { id }
		};

		return HttpClient.request<DeleteQuery, undefined>(request, RequestType.REMOVE);
	}

	public async remove_many(ids: number[]): Promise<Response<undefined>> {
		const request: Requests<DeleteManyQuery>[RequestType.REMOVE] = {
			route: `/user`,
			headers: new Headers(),
			parameters: { ids: ids }
		};

		return HttpClient.request<DeleteManyQuery, undefined>(request, RequestType.REMOVE);
	}
}
