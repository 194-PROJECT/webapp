import { Context } from '$core/context/context';
import { ResponseType } from '$core/backend/response.type';
import type { ResponseTypes } from '$core/backend/response.type';
import { RequestType } from '$core/backend/request.type';
import type { RequestTypes } from '$core/backend/request.type';
import type { RequestContentType, ResponseContentType } from '$core/backend/content.type';
import { CookieManager } from '$core/helpers/cookies';
import type { HttpHeader } from '$core/backend/header.type';

export class HttpClient<T> {
	public async request(
		request: RequestTypes<T>[RequestType],
		type: RequestType,
		credentials: RequestCredentials = 'include',
		header: Partial<HttpHeader> = {}
	): Promise<ResponseTypes<T>[ResponseType]> {
		let headers = this._header(header);
		let url = request.url;
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

		return await fetch(url, init)
			.then(async (response) => {
				if (!response.ok)
					throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
				return (await Promise.resolve(response.json())) as ResponseTypes<T>[ResponseType];
			})
			.then((data) => {
				return data;
			})
			.catch((error) => {
				throw error;
			});
	}

	/**
	 * Build the headers for the request based on the user context, the header object and the default values
	 * A lot of the headers are set by default, but can be overwritten by the header object
	 *
	 * @param header
	 * @returns
	 */
	private _header(header: Partial<HttpHeader>): Headers {
		let UserContext = Context.getUserContext();
		let headers = new Headers();

		const defaultHeaders: Partial<HttpHeader> = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${UserContext.session.token}`,
			Accept: 'application/json',
			'Access-Control-Allow-Origin': '*',
			Cookie: CookieManager.cookie() || ''
		};

		Object.entries({ ...defaultHeaders, ...header }).forEach(([key, value]) => {
			headers.append(key, value);
		});

		return headers;
	}
}
