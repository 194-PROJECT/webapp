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
import type { Student } from './student.type';
import type { Response } from '$core/backend/response.type';
import type { StudentGetResponse } from './student-backend.type';
import { StudentTransformer } from './student.transformer';

export class StudentBackend implements Backend<Student> {
	public async fetch(id: number): Promise<Response<Student>> {
		const request: Requests<GetQuery>[RequestType.FETCH] = {
			route: `/student/${id}`,
			headers: new Headers(),
			parameters: { id }
		};

    let response = await HttpClient.request<GetQuery, StudentGetResponse>(request, RequestType.FETCH);
    return Promise.resolve(StudentTransformer.transformGetResponse(response));
	}

	public async fetch_many(query: GetManyQuery): Promise<Response<Student[]>> {
		const request: Requests<GetManyQuery>[RequestType.FETCH] = {
			route: `/student`,
			headers: new Headers(),
			parameters: query
		};

    let response = await HttpClient.request<GetManyQuery, StudentGetResponse[]>(request, RequestType.FETCH);
    return Promise.resolve(StudentTransformer.transformGetManyResponse(response));
	}

	public async push(item: Student): Promise<Response<Student>> {
		const request: Requests<Student>[RequestType.PUSH] = {
			route: '/student',
			headers: new Headers(),
			body: item
		};

    let response = await HttpClient.request<Student, StudentGetResponse>(request, RequestType.PUSH);
    return Promise.resolve(StudentTransformer.transformGetResponse(response));
	}

	public async update(id: number, item: Partial<Student>): Promise<Response<Student>> {
		const request: Requests<Partial<Student>>[RequestType.UPDATE] = {
			route: `/student/${id}`,
			headers: new Headers(),
			body: item
		};

    let response = await HttpClient.request<Partial<Student>, StudentGetResponse>(request, RequestType.UPDATE);
    return Promise.resolve(StudentTransformer.transformGetResponse(response));
	}

	public async remove(id: number): Promise<Response<any>> {
		const request: Requests<DeleteQuery>[RequestType.REMOVE] = {
			route: `/student/${id}`,
			headers: new Headers(),
			parameters: { id }
		};

		return HttpClient.request<DeleteQuery, undefined>(request, RequestType.REMOVE);
	}

	public async remove_many(ids: number[]): Promise<Response<undefined>> {
		const request: Requests<DeleteManyQuery>[RequestType.REMOVE] = {
			route: `/student`,
			headers: new Headers(),
			parameters: { ids: ids }
		};

		return HttpClient.request<DeleteManyQuery, undefined>(request, RequestType.REMOVE);
	}
}
