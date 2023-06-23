import { DispatcherService } from "./events/dispatcher";
import { InfrazApi } from "./services/api/infraz.api";
import { ShowsApi } from "./services/api/shows.api";
import { TmdbApi } from "./services/api/tmdb.api";
import { WarezApi } from "./services/api/warez.api";
import { BrowserHelperService } from "./services/helpers/browser-helper.service";
import { CacheHelperService } from "./services/helpers/cache-helper.service";

export const makeBrowserHelperService = () => {
  return new BrowserHelperService(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 Edg/92.0.902.67"
  );
};

export const makeCacheHelperService = () => {
  return new CacheHelperService();
};

export const makeTmdbApi = () => {
  return new TmdbApi();
};

export const makeShowsApi = () => {
  return new ShowsApi();
};

export const makeWarezApi = () => {
  return new WarezApi(makeBrowserHelperService(), makeCacheHelperService());
};

export const makeInfrazApi = () => {
  return new InfrazApi(makeBrowserHelperService());
};

const dispatcher = new DispatcherService();
export const makeDispatcherService = () => {
  return dispatcher;
};

export { DispatcherService };
