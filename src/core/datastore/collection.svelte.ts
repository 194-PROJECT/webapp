import type { Response } from "$core/backend/response.type";

export class Collection<T> {
  public value = $state<T[]>();
  public page = $state<number>();
  public totalRows = $state<number>();
  public response = $state<Response<T[]>>();

  constructor({
    value,
    response = undefined,
    page = undefined,
    totalRows = undefined,
  }: {
    value?: T[],
    page?: number,
    totalRows?: number,
    response?: Response<T[]>,
  }) {
    this.value = value;
    this.response = response;
    this.page = page;
    this.totalRows = totalRows;
  }
}
