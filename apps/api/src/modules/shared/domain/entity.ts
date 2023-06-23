export class Entity<T> {
  constructor(public props: T) {}

  public toJSON() {
    return this.props;
  }
}
