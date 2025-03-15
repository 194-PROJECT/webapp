import type { Query } from "./request.type";
import type { Response } from "./response.type";

export interface Backend<T> {
  fetch: (query: Query) => Response<T>;
  push: (item: T|T[]) => Response<T>;
  set: (id: Number, item: T) => Response<T>;
  update: (id: Number, item: Partial<T>) => Response<T>;
  remove: (id: Number) => Response<T>;
  socketEvent: T;
}