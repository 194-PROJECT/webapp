export class Document<T> {
  public loading: boolean = false;
  public value = $state<T>();

  constructor(
    value: T,
  ) {
    this.value = value;
  }
}