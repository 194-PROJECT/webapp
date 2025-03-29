import type { Cookies } from "@sveltejs/kit";
import type { GetManyQuery, GetQuery } from "./request.type";
import type { Response } from "./response.type";

export interface Backend<T> {
  fetch?(id: number): Promise<Response<T>>;
  fetch?(id: number, cookies: Cookies, locals: App.Locals): Promise<Response<T>>;
  fetch_many?(query: Partial<GetManyQuery>): Promise<Response<T[]>>;
  fetch_many?(query: Partial<GetManyQuery>, cookies: Cookies, locals: App.Locals): Promise<Response<T[]>>;
  push?(item: Partial<Omit<T, 'id'>>): Promise<Response<Partial<Omit<T, 'id'>>>>;
  push?(item: Partial<Omit<T, 'id'>>, cookies: Cookies, locals: App.Locals): Promise<Response<Partial<Omit<T, 'id'>>>>;
  set?(id: number, item: T): Promise<Response<T>>;
  set?(id: number, item: T, cookies: Cookies, locals: App.Locals): Promise<Response<T>>;
  update?(id: number, item: Partial<T>): Promise<Response<T>>;
  update?(id: number, item: Partial<T>, cookies: Cookies, locals: App.Locals): Promise<Response<T>>;
  remove?(id: number): Promise<Response<undefined>>;
  remove?(id: number, cookies: Cookies, locals: App.Locals): Promise<Response<undefined>>;
  remove_many?(ids: number[]): Promise<Response<undefined>>;
  remove_many?(ids: number[], cookies: Cookies, locals: App.Locals): Promise<Response<undefined>>;
}