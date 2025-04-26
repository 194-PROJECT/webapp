import { Collection } from "./collection.svelte";
import { Document } from "./document.svelte";
import type { Backend } from "$core/backend/backend.type";
import type { GetManyQuery } from "$core/backend/request.type";

export class Datastore<T> {
  constructor(
    private backend: Backend<T>,
  ){}

  public async get(id?: number): Promise<Document<T>>;
  public async get(query: Partial<GetManyQuery>): Promise<Collection<T>>;
  public async get(param: number | Partial<GetManyQuery> | undefined): Promise<Document<T> | Collection<T>> {
    if (typeof param === 'number') {
      if (!this.backend.fetch) {
        throw new Error("Fetch method not implemented");
      }

      const response = await this.backend.fetch(param);
      return new Document<T>({
        value: response.data,
        response: response,
      });
    }

    if(typeof param === 'object') {
      if (!this.backend.fetch_many) {
        throw new Error("Fetch many method not implemented");
      }

      const response = await this.backend.fetch_many(param);
      return new Collection<T>({
        value: response.data,
        page: response.page,
        totalRows: response.total_rows,
        response: response,
      });
    }

    return new Document<T>({
      value: undefined,
      response: undefined,
    });

  }

  public async push(item: Partial<Omit<T, 'id'>>): Promise<Document<Partial<T>>> {
    if (!this.backend.push) {
      throw new Error("Push method not implemented");
    }

    const response = await this.backend.push(item);
    return new Document<Partial<T>>({
      value: response.data,
      response: response,
    });
  }

  public async update(id: number, item: Partial<T>): Promise<Document<T>> {
    if (!this.backend.update) {
      throw new Error("Update method not implemented");
    }

    const response = await this.backend.update(id, item);
    return new Document<T>({
      value: response.data,
      response: response,
    });
  }

  public async remove(id: number): Promise<Document<undefined>> {
    if (!this.backend.remove) {
      throw new Error("Remove method not implemented");
    }

    const response = await this.backend.remove(id);
    return new Document<undefined>({
      value: response.data,
      response: response,
    });
  }

  public async removeMany(ids: number[]): Promise<Document<undefined>> {
    if (!this.backend.remove_many) {
      throw new Error("Remove many method not implemented");
    }

    const response = await this.backend.remove_many(ids);
    return new Document<undefined>({
      value: response.data,
      response: response,
    });
  }
}
