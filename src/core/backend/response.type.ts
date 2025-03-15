type Payload = Record<string, string>;

export interface Response<T> {
	message: string;
	data: T;
  errors?: Array<string>;
}

export interface SocketEventResponse<T> extends Response<T> {
	event: string;
	data: any;
}