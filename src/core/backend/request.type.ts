export type Query = Record<string, any>;

export enum RequestType {
	FETCH = 1,
	PUSH,
	SET,
	UPDATE,
	REMOVE,
}

interface Request {
	url: string;
	headers: Headers;
}

interface FetchRequest<T> extends Request {
	parameters: Query;
}

interface PushRequest<T> extends Request {
	body: Query;
}

interface SetRequest<T> extends Request {
	body: Query;
}

interface UpdateRequest<T> extends Request {
	body: Query;
}

interface RemoveRequest<T> extends Request {
	parameters: Query;
}

export type RequestTypes<T> = {
	[RequestType.FETCH]: FetchRequest<T>;
	[RequestType.PUSH]: PushRequest<T>;
	[RequestType.SET]: SetRequest<T>;
	[RequestType.UPDATE]: UpdateRequest<T>;
	[RequestType.REMOVE]: RemoveRequest<T>;
};
