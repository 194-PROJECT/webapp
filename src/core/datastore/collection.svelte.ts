export class Collection<T> {
  loading: boolean = false;
  public value = $state<T[]>();

  constructor(
    value: T[],
  ) {
    this.value = value;
  }
}