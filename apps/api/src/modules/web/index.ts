import { LoadAllPathsHttpController } from "./controllers/load-all-paths.http.controller";
import { LoadAllPaths } from "./use-cases/load-all-paths";

export const makeLoadAllPaths = () => {
  return new LoadAllPaths();
};

export const makeLoadAllPathsHttpController = () => {
  return new LoadAllPathsHttpController(makeLoadAllPaths());
};
