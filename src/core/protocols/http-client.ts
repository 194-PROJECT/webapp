import type { Response } from '$core/backend/response.type';
import { RequestType } from '$core/backend/request.type';
import type { Requests } from '$core/backend/request.type';
import type { RequestContentType, ResponseContentType } from '$core/backend/content.type';
import type { HttpHeader } from '$core/backend/header.type';

import type { Cookies } from '@sveltejs/kit';

import { HTTP_PROTOCOL, API_URL, API_PORT } from '$env/static/private';
import { toast } from 'svelte-sonner';

const API_BASE_URL = `${HTTP_PROTOCOL}://${API_URL}:${API_PORT}`;

export class HttpClient {
	public static async request<T>(
		request: Requests<T>[RequestType],
		type: RequestType,
    cookies?: Cookies,
    locals?: App.Locals,
		header: Partial<HttpHeader> = {},
		credentials: RequestCredentials = 'include',
	): Promise<Response<T>> {
		let headers = HttpClient._header(header, cookies, locals);
		let route = request.route;
		let init: RequestInit = {
			method: 'GET',
			headers: headers,
			body: '',
			credentials
		};

		if ('parameters' in request) {
			init.body = JSON.stringify(request.parameters);
		} else if ('body' in request) {
			init.body = JSON.stringify(request.body);
		}

		switch (type) {
			case RequestType.FETCH:
				init.method = 'GET';
				break;
			case RequestType.PUSH:
				init.method = 'POST';
				break;
			case RequestType.SET:
				init.method = 'PUT';
				break;
			case RequestType.UPDATE:
				init.method = 'PATCH';
				break;
			case RequestType.REMOVE:
				init.method = 'DELETE';
				break;
			default:
				throw new Error('Invalid request type');
		}

    const response = await fetch(`${API_BASE_URL}${route}`, init);
    const data: Response<T> = await response.json();

    if (!response.ok) {
      console.error(`${response.status} ${response.statusText}: ${data.message}`);
    }

    return data;
	}

	/**
	 * Build the headers for the request based on the user context, the header object and the default values
	 * A lot of the headers are set by default, but can be overwritten by the header object
	 *
	 * @param header
	 * @returns
	 */
	private static _header(
    header: Partial<HttpHeader>,
    cookie?: Cookies,
    locals?: App.Locals
  ): Headers {
		let headers = new Headers();
    const session = locals?.session;

		const defaultHeaders: Partial<HttpHeader> = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${session?.token}`,
			Accept: 'application/json',
			'Access-Control-Allow-Origin': '*',
		};

		Object.entries({ ...defaultHeaders, ...header }).forEach(([key, value]) => {
			headers.append(key, value);
		});

		return headers;
	}
}
