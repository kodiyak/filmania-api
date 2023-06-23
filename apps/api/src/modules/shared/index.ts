import { DispatcherService } from "./events/dispatcher";

const dispatcher = new DispatcherService();

export const makeDispatcherService = () => {
  return dispatcher;
};

export { DispatcherService };
