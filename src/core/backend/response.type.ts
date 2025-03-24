type Payload = Record<string, string>;

export interface Response<T> {
	message: string;
	data?: T;
  errors?: Array<string>;
  page?: number;
  total_rows?: number;
}

export interface SocketEventResponse<T> extends Response<T> {
	event: string;
	data: any;
}