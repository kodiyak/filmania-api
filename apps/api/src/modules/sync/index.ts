import { makeShowsApi } from "../shared";
import { SyncSerieService } from "./services/sync-serie.service";

export const makeSyncSerieService = () => {
  return new SyncSerieService(makeShowsApi());
};
