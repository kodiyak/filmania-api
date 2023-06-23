import axios from "axios";
import {
  IShowsApi,
  IShowsEpisodeApi,
  IShowsMovieApi,
} from "../contracts/shows.api.interfaces";

export class ShowsApi {
  public consumersHttp = axios.create({
    baseURL: "https://api.v2.consumers.filmania.tv/api",
  });

  public async getShowByImdbId(imdbId: string) {
    return this.consumersHttp
      .get<IShowsApi.Root>(`/shows/${imdbId}`)
      .then((res) => res.data.data);
  }

  public async getShowMovieByImdbId(imdbId: string) {
    return this.consumersHttp
      .get<IShowsMovieApi.Root>(`/shows/${imdbId}`)
      .then((res) => res.data.data);
  }

  public async getShowEpisodeByImdbId(
    imdbId: string,
    seasonNumber: number,
    episodeNumber: number
  ) {
    return this.consumersHttp
      .get<IShowsEpisodeApi.Root>(
        `/shows/${imdbId}/seasons/${seasonNumber}/episodes/${episodeNumber}`
      )
      .then((res) => res.data.data);
  }
}
