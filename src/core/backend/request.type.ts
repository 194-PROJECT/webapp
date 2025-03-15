export type Query = Record<string, any>;

export enum RequestType {
	FETCH = 1,
	PUSH,
	SET,
	UPDATE,
	REMOVE,
}

interface Request {
	route: string;
	headers: Headers;
}

interface FetchRequest<T> extends Request {
	parameters: T | Query;
}

interface PushRequest<T> extends Request {
	body: T | Query;
}

interface SetRequest<T> extends Request {
	body: T | Query;
}

interface UpdateRequest<T> extends Request {
	body: T | Query;
}

interface RemoveRequest<T> extends Request {
	parameters: T | Query;
}

export type Requests<T> = {
	[RequestType.FETCH]: FetchRequest<T>;
	[RequestType.PUSH]: PushRequest<T>;
	[RequestType.SET]: SetRequest<T>;
	[RequestType.UPDATE]: UpdateRequest<T>;
	[RequestType.REMOVE]: RemoveRequest<T>;
};
