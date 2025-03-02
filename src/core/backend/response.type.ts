type Payload = Record<string, string>;

export enum ResponseType {
	FETCH = 1,
	PUSH,
	SET,
	UPDATE,
	REMOVE,
	SOCKET_EVENT,
}

interface Response {
	status: number;
	message: string;
	data?: any;
}

interface FetchResponse<T> extends Response {
	data: { items: T[] | undefined } & Payload;
}

interface PushResponse<T> extends Response {
	data?: any;
}

interface SetResponse<T> extends Response {
	data?: any;
}

interface UpdateResponse<T> extends Response {
	data?: any;
}

interface RemoveResponse<T> extends Response {
	data?: any;
}

interface SocketEventResponse<T> extends Response {
	event: string;
	data: any;
}

export type ResponseTypes<T> = {
	[ResponseType.FETCH]: FetchResponse<T>;
	[ResponseType.PUSH]: PushResponse<T>;
	[ResponseType.SET]: SetResponse<T>;
	[ResponseType.UPDATE]: UpdateResponse<T>;
	[ResponseType.REMOVE]: RemoveResponse<T>;
	[ResponseType.SOCKET_EVENT]: SocketEventResponse<T>;
};