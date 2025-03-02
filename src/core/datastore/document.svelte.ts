export class Document<T> {
  loading: boolean = false;

  constructor(
    public value = $state<T>(),
  ) {}
}