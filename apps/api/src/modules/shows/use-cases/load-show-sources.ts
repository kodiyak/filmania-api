import { DispatcherService } from "@/modules/shared";
import { LoadShowSourcesQuery } from "../queries/load-show-sources.query";
import { db } from "@/lib/db";
import { ShowsApi } from "@/modules/shared/services/api/shows.api";
import {
  IShowsEpisodeApi,
  IShowsMovieApi,
} from "@/modules/shared/services/contracts/shows.api.interfaces";
import { ApplicationService } from "@/modules/shared/services/app.service";
import { Show } from "@prisma/client";

export class LoadShowSources {
  constructor(
    private readonly showsApi: ShowsApi,
    private readonly app: ApplicationService
  ) {}

  public async load(command: LoadShowSourcesQuery) {
    const {
      slug,
      episode: episodeNumber,
      season: seasonNumber,
    } = command.props;

    const show = await db.show.findFirstOrThrow({
      where: { slug },
    });

    if (show.type !== "movie" && (!episodeNumber || !seasonNumber)) {
      throw new Error("Season and episode are required");
    }

    let sources: any;

    if (show.type !== "movie") {
      sources = await this.getSerieEpisodeSources({
        showId: show.id,
        imdbId: show.imdbId,
        seasonNumber,
        episodeNumber,
      });
    } else {
      sources = await this.getMovieSources({
        showId: show.id,
        imdbId: show.imdbId,
      });
    }

    return {
      sources,
    };
  }

  private async getMovieSources({
    imdbId,
    showId,
  }: {
    showId: string;
    imdbId: string;
  }) {
    const showData = await this.showsApi
      .getShowMovieByImdbId(imdbId)
      .catch(() => {
        throw new Error(`Cannot load sources for show "${imdbId}"`);
      });

    const sources = await Promise.all([
      this.parseMovieInfrazSources(showId, showData),
      this.parseMovieWarezSources(showId, showData),
    ]).then((res) => {
      return res.reduce((acc: any, val: any) => [...acc, ...val], []);
    });

    return sources;
  }

  private async parseMovieInfrazSources(
    showId: string,
    showData: IShowsMovieApi.Data
  ) {
    if (!showData.infraz) {
      return [];
    }

    return [
      {
        quality: "1080p",
        type: "native",
        url: this.app.withApiUrl(`/api/stream/iz/${showId}.mp4`),
        lang: "dub",
      },
    ];
  }

  private async parseMovieWarezSources(
    showId: string,
    episodeData: IShowsMovieApi.Data
  ) {
    if (!episodeData.warez) {
      return [];
    }

    return episodeData.warez.sources.map((source) => ({
      quality: "720p",
      type: "embed",
      url: source.url,
      subtitle: source.subtitleUrl,
      lang: source.lang,
    }));
  }

  private async getSerieEpisodeSources({
    episodeNumber,
    imdbId,
    seasonNumber,
    showId,
  }: {
    showId: string;
    imdbId: string;
    seasonNumber: number;
    episodeNumber: number;
  }) {
    const season = await db.season.findFirstOrThrow({
      where: {
        showId: showId,
        number: seasonNumber,
      },
      select: {
        episodes: {
          where: {
            number: episodeNumber,
          },
          select: { id: true },
        },
      },
    });

    const episodeData = await this.showsApi
      .getShowEpisodeByImdbId(imdbId, seasonNumber, episodeNumber)
      .catch(() => {
        throw new Error(
          `Cannot load sources for show "${imdbId}" season ${seasonNumber} episode ${episodeNumber}`
        );
      });

    const episodeId = season.episodes?.[0]?.id;

    if (!episodeId) {
      throw new Error(
        `Cannot load sources for show "${imdbId}" season ${seasonNumber} episode ${episodeNumber}`
      );
    }

    const sources = await Promise.all([
      this.parseEpisodeInfrazSources(episodeId, episodeData),
      this.parseEpisodeWarezSources(episodeId, episodeData),
    ]).then((res) => {
      return res.reduce((acc: any, val: any) => [...acc, ...val], []);
    });

    return sources;
  }

  private async parseEpisodeInfrazSources(
    episodeId: string,
    episodeData: IShowsEpisodeApi.Data
  ) {
    if (!episodeData.infraz) {
      return [];
    }

    return [
      {
        quality: "1080p",
        type: "native",
        url: this.app.withApiUrl(`/api/stream/iz/${episodeId}.mp4`),
        lang: "dub",
      },
    ];
  }

  private async parseEpisodeWarezSources(
    episodeId: string,
    episodeData: IShowsEpisodeApi.Data
  ) {
    if (!episodeData.warez) {
      return [];
    }

    return episodeData.warez.sources.map((source) => ({
      quality: "720p",
      type: "embed",
      url: source.url,
      subtitle: source.subtitleUrl,
      lang: source.lang,
    }));
  }
}
