import type { Query } from "./request.type";
import type { ResponseType, ResponseTypes } from "./response.type";

export interface Backend<T> {
  fetch: (query: Query) => ResponseTypes<T>[ResponseType.FETCH];
  push: (item: T|T[]) => ResponseTypes<T>[ResponseType.PUSH];
  set: (id: Number, item: T) => ResponseTypes<T>[ResponseType.SET];
  update: (id: Number, item: Partial<T>) => ResponseTypes<T>[ResponseType.UPDATE];
  remove: (id: Number) => ResponseTypes<T>[ResponseType.REMOVE];
  socketEvent: T;
}