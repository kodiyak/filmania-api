import { DomainEvent } from "./domain-event";
import { DomainEventHandler } from "./domain-event-handler";

export class DispatcherService {
  private handlersMap = new Map<string, DomainEventHandler<DomainEvent>[]>();

  public register<T extends DomainEvent>(
    eventType: new (...args: any[]) => T,
    handler: DomainEventHandler<T>
  ): void {
    const eventName = eventType.name;
    const handlers = this.handlersMap.get(eventName) || [];
    handlers.push(handler);
    this.handlersMap.set(eventName, handlers);
  }

  public async dispatch(event: DomainEvent): Promise<void> {
    const handlers = this.handlersMap.get(event.constructor.name) || [];
    for (const eventHandler of handlers) {
      await eventHandler.handler(event);
    }
  }
}
