import type { Response } from '$core/backend/response.type';
import { RequestType } from '$core/backend/request.type';
import type { Query, Requests } from '$core/backend/request.type';
import type { HttpHeader } from '$core/backend/header.type';

import type { Cookies } from '@sveltejs/kit';

import { PUBLIC_HTTP_PROTOCOL, PUBLIC_API_URL, PUBLIC_API_PORT } from '$env/static/public';
import { transformCamelKeysToSnakeCase } from '$lib/utils';

export const API_BASE_URL = `${PUBLIC_HTTP_PROTOCOL}://${PUBLIC_API_URL}:${PUBLIC_API_PORT}`;

export class HttpClient {
	public static async request<RQ extends Query, RP>(
		request: Requests<RQ>[RequestType],
		type: RequestType,
    cookies?: Cookies,
    locals?: App.Locals,
		header: Partial<HttpHeader> = {},
		credentials: RequestCredentials = 'include',
	): Promise<Response<RP>> {
		let headers = HttpClient._header(header, cookies, locals);
		let route = request.route;
		let init: RequestInit = {
			method: 'GET',
			headers: headers,
			body: undefined,
			credentials
		};

    /**
     * If the request has a body, we need to transform the keys from camelCase to snake_case
     * This is because the backend expects snake_case keys in the request body and we want to
     * keep the frontend code in camelCase for consistency
     */
    if ('body' in request) {
      request.body = transformCamelKeysToSnakeCase<RQ>(request.body);
			init.body = JSON.stringify(request.body);
    }

    /**
     * If the request has parameters, we need to add them to the URL as query parameters
     */
		if ('parameters' in request) {
      request.parameters = transformCamelKeysToSnakeCase<RQ>(request.parameters);
      route = `${route}?${HttpClient._getSearchParams(request.parameters)}`;
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
    const data: Response<RP> = await response.json();
    data.status = response.status;

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
		};

		Object.entries({ ...defaultHeaders, ...header }).forEach(([key, value]) => {
			headers.append(key, value);
		});

		return headers;
	}

  private static _getSearchParams(params: Query): string {
    const searchParams = new URLSearchParams();

    for (const key in params) {
      if (Array.isArray(params[key])) {
        params[key].forEach(val => searchParams.append(key, val));
      } else if (typeof params[key] === 'object' && params[key] !== null) {
        searchParams.append(key, JSON.stringify(params[key]));
      } else {
        searchParams.set(key, params[key]);
      }
    }

    return searchParams.toString();
  }
}
