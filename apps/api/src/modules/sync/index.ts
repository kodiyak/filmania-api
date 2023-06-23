import { makeShowsApi, makeTmdbApi } from "../shared";
import { SyncMovieService } from "./services/sync-movie.service";
import { SyncSerieService } from "./services/sync-serie.service";

export const makeSyncSerieService = () => {
  return new SyncSerieService(makeShowsApi(), makeTmdbApi());
};

export const makeSyncMovieService = () => {
  return new SyncMovieService(makeShowsApi());
};
