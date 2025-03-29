export type Query = Record<string, any>;

export type GetQuery = {
  id: number;
}

export type GetManyQuery = {
  order_by?: string;
  order_direction?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  page?: number;
  page_size?: number;
  /**
   * we'll support filtering by a single field for now. Support for multiple fields will be added later.
   * we need to create field[], operator[], and value[] arrays to support multiple fields.
   */
  field?: string;
  operator?: Operator;
  value?: string | number | string[] | number[];
};

export type DeleteQuery = {
  id: number;
}

export type DeleteManyQuery = {
  ids: number[];
}

export enum Operator {
  EQUALS = '=',
  NOT_EQUALS = '<>',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  GREATER_THAN_OR_EQUAL = '>=',
  LESS_THAN_OR_EQUAL = '<=',
  LIKE = 'LIKE',
  NOT_LIKE = 'NOT LIKE',
  IS_NULL = 'IS NULL',
  IS_NOT_NULL = 'IS NOT NULL',
  IN = 'IN',
  NOT_IN = 'NOT IN',
};

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
	parameters: T;
}

interface PushRequest<T> extends Request {
	body: T;
}

interface SetRequest<T> extends Request {
	body: T;
}

interface UpdateRequest<T> extends Request {
	body: T;
}

interface RemoveRequest<T> extends Request {
	parameters: T;
}

export type Requests<T> = {
	[RequestType.FETCH]: FetchRequest<T>;
	[RequestType.PUSH]: PushRequest<T>;
	[RequestType.SET]: SetRequest<T>;
	[RequestType.UPDATE]: UpdateRequest<T>;
	[RequestType.REMOVE]: RemoveRequest<T>;
};
