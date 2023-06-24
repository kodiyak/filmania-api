import { LoadShowsHttpController } from "./controllers/load-shows.http.controller";
import { LoadShows } from "./use-cases/load-shows";
import { ViewShowHttpController } from "./controllers/view-show.http.controller";
import { ViewShow } from "./use-cases/view-show";

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
