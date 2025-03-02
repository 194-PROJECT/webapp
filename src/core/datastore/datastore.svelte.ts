import { Collection } from "./collection.svelte";
import { Document } from "./document.svelte";
import type { Backend } from "$core/backend/backend.type";
import type { Query } from "$core/backend/request.type";

export class Datastore<T> {
  constructor(
    private backend: Backend<T>,
    public collection = new Collection<T>(),
    public document = new Document<T>(),
  ){}

  public get(
    query: Query,
    type: 'collection'|'document' = 'collection'
  ) {
  }
}