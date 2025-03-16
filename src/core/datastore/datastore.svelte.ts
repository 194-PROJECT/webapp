import { Collection } from "./collection.svelte";
import { Document } from "./document.svelte";
import type { Backend } from "$core/backend/backend.type";
import type { GetManyQuery } from "$core/backend/request.type";

export class Datastore<T> {
  constructor(
    private backend: Backend<T>,
  ){}

  public async get(id: number): Promise<Document<T>>;
  public async get(query: Partial<GetManyQuery>): Promise<Collection<T>>;
  public async get(param: number | Partial<GetManyQuery>): Promise<Document<T> | Collection<T>> {
    if (typeof param === 'number') {
      const response = await this.backend.fetch(param).then((response) => response);
      return new Document<T>(response.data);
    } else {
      const response = await this.backend.fetch_many(param);
      return new Collection<T>(response.data);
    }
  }

  public async push(item: T): Promise<Document<T>> {
    const response = await this.backend.push(item);
    return new Document<T>(response.data);
  }

  public async update(id: number, item: Partial<T>): Promise<Document<T>> {
    const response = await this.backend.update(id, item);
    return new Document<T>(response.data);
  }

  public remove(id: number): void {
    this.backend.remove(id);
  }

  public removeMany(ids: number[]): void {
    this.backend.remove_many(ids);
  }
}