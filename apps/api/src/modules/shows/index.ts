import { LoadShowsHttpController } from "./controllers/load-shows.http.controller";
import { LoadShows } from "./use-cases/load-shows";
import { ViewShowHttpController } from "./controllers/view-show.http.controller";
import { ViewShow } from "./use-cases/view-show";
import { LoadShowSourcesHttpController } from "./controllers/load-show-sources.http.controller";
import { LoadShowSources } from "./use-cases/load-show-sources";
import { makeApplicationService, makeShowsApi } from "../shared";
import { LoadShowSeasonsHttpController } from "./controllers/load-show-seasons.http.controller";
import { LoadShowSeasons } from "./use-cases/load-show-seasons";
import { LoadShowSeasonEpisodesHttpController } from "./controllers/load-show-season-episodes.http.controller";
import { LoadShowSeasonEpisodes } from "./use-cases/load-show-season-episodes";

export const makeLoadShowSeasonEpisodes = () => {
  return new LoadShowSeasonEpisodes(makeApplicationService());
};

export const makeLoadShowSeasonEpisodesHttpController = () => {
  return new LoadShowSeasonEpisodesHttpController(makeLoadShowSeasonEpisodes());
};

export const makeLoadShowSeasons = () => {
  return new LoadShowSeasons(makeApplicationService());
};

export const makeLoadShowSeasonsHttpController = () => {
  return new LoadShowSeasonsHttpController(makeLoadShowSeasons());
};

export const makeLoadShowSources = () => {
  return new LoadShowSources(makeShowsApi(), makeApplicationService());
};

export const makeLoadShowSourcesHttpController = () => {
  return new LoadShowSourcesHttpController(makeLoadShowSources());
};

export const makeViewShow = () => {
  return new ViewShow(makeApplicationService());
};

export const makeViewShowHttpController = () => {
  return new ViewShowHttpController(makeViewShow());
};

export const makeLoadShows = () => {
  return new LoadShows(makeApplicationService());
};

export const makeLoadShowsHttpController = () => {
  return new LoadShowsHttpController(makeLoadShows());
};
