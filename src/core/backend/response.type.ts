type Payload = Record<string, string>;

export interface Response<T> {
	message: string;
	data?: T;
  page?: number;
  total_rows?: number;
  status?: number;
  errors?: Array<string>;
}

export interface SocketEventResponse<T> extends Response<T> {
	event: string;
	data: any;
}