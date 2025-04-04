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
import type { Course } from './course.type';
import type { Response } from '$core/backend/response.type';
import type { CourseGetResponse } from './course-backend.type';
import { CourseTransformer } from './course.transformer';

export class CourseBackend implements Backend<Course> {
  public async fetch(id: number): Promise<Response<Course>> {
    const request: Requests<GetQuery>[RequestType.FETCH] = {
      route: `/course/${id}`,
      headers: new Headers(),
      parameters: { id },
    };

    let response = await HttpClient.request<GetQuery, CourseGetResponse>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(CourseTransformer.transformGetResponse(response));
  }

  public async fetch_many(query: GetManyQuery): Promise<Response<Course[]>> {
    const request: Requests<GetManyQuery>[RequestType.FETCH] = {
      route: `/course`,
      headers: new Headers(),
      parameters: query,
    };

    let response = await HttpClient.request<GetManyQuery, CourseGetResponse[]>(
      request,
      RequestType.FETCH
    );
    return Promise.resolve(CourseTransformer.transformGetManyResponse(response));
  }

  public async push(item: Course): Promise<Response<Course>> {
    const request: Requests<Course>[RequestType.PUSH] = {
      route: '/course',
      headers: new Headers(),
      body: item,
    };

    let response = await HttpClient.request<Course, CourseGetResponse>(
      request,
      RequestType.PUSH
    );
    return Promise.resolve(CourseTransformer.transformGetResponse(response));
  }

  public async update(id: number, item: Partial<Course>): Promise<Response<Course>> {
    const request: Requests<Partial<Course>>[RequestType.UPDATE] = {
      route: `/course/${id}`,
      headers: new Headers(),
      body: item,
    };

    let response = await HttpClient.request<Partial<Course>, CourseGetResponse>(
      request,
      RequestType.UPDATE
    );
    return Promise.resolve(CourseTransformer.transformGetResponse(response));
  }

  public async remove(id: number): Promise<Response<any>> {
    const request: Requests<DeleteQuery>[RequestType.REMOVE] = {
      route: `/course/${id}`,
      headers: new Headers(),
      parameters: { id },
    };

    return HttpClient.request<DeleteQuery, undefined>(request, RequestType.REMOVE);
  }

  public async remove_many(ids: number[]): Promise<Response<undefined>> {
    const request: Requests<DeleteManyQuery>[RequestType.REMOVE] = {
      route: `/course`,
      headers: new Headers(),
      parameters: { ids: ids },
    };

    return HttpClient.request<DeleteManyQuery, undefined>(request, RequestType.REMOVE);
  }
}
