export abstract class DomainEvent<T = any> {
  // public abstract readonly name: string;

  constructor(public readonly props: T) {}
}
