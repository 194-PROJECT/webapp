import type { Response } from "$core/backend/response.type";

export class Document<T> {
  public value = $state<T>();
  public response = $state<Response<T>>();

  constructor({
    value = undefined,
    response = undefined,
  }: {
    value?: T,
    response?: Response<T>,
  }) {
    this.value = value;
    this.response = response;
  }
}
