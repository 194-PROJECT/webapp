export class Collection<T> {
  loading: boolean = false;

  constructor(
    public value = $state<T[]>(),
  ) {}
}