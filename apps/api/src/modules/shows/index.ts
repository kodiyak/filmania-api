import { LoadShowsHttpController } from "./controllers/load-shows.http.controller";
import { LoadShows } from "./use-cases/load-shows";

export const makeLoadShows = () => {
  return new LoadShows();
};

export const makeLoadShowsHttpController = () => {
  return new LoadShowsHttpController(makeLoadShows());
};
