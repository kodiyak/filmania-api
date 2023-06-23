import { DomainEvent } from "./domain-event";

export abstract class DomainEventHandler<T extends DomainEvent> {
  public abstract handler(event: T): Promise<void>;
}
