export class Collection<T> {
  loading: boolean = false;
  public value = $state<T[]>();
  public page = $state<number>();
  public totalRows = $state<number>();

  constructor({
    value,
    page = undefined,
    totalRows = undefined,
  }: {
    value: T[],
    page?: number,
    totalRows?: number
  }) {
    this.value = value;
    this.page = page;
    this.totalRows = totalRows;
  }
}
