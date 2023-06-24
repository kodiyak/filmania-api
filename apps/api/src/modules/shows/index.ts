import { LoadShowsHttpController } from "./controllers/load-shows.http.controller";
import { LoadShows } from "./use-cases/load-shows";
import { ViewShowHttpController } from "./controllers/view-show.http.controller";
import { ViewShow } from "./use-cases/view-show";
import { LoadShowSourcesHttpController } from "./controllers/load-show-sources.http.controller";
import { LoadShowSources } from "./use-cases/load-show-sources";
import { makeApplicationService, makeShowsApi } from "../shared";

export const makeLoadShowSources = () => {
  return new LoadShowSources(makeShowsApi(), makeApplicationService());
};

export const makeLoadShowSourcesHttpController = () => {
  return new LoadShowSourcesHttpController(makeLoadShowSources());
};

export const makeViewShow = () => {
  return new ViewShow();
};

export const makeViewShowHttpController = () => {
  return new ViewShowHttpController(makeViewShow());
};

export const makeLoadShows = () => {
  return new LoadShows();
};

export const makeLoadShowsHttpController = () => {
  return new LoadShowsHttpController(makeLoadShows());
};
