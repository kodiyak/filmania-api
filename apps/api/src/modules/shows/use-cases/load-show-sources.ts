import { DispatcherService } from "@/modules/shared";
import { LoadShowSourcesQuery } from "../queries/load-show-sources.query";
import { db } from "@/lib/db";
import { ShowsApi } from "@/modules/shared/services/api/shows.api";
import { IShowsEpisodeApi } from "@/modules/shared/services/contracts/shows.api.interfaces";
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

    const season = await db.season.findFirstOrThrow({
      where: {
        showId: show.id,
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
      .getShowEpisodeByImdbId(show.imdbId, seasonNumber, episodeNumber)
      .catch(() => {
        throw new Error(
          `Cannot load sources for show "${show.imdbId}" season ${seasonNumber} episode ${episodeNumber}`
        );
      });

    const episodeId = season.episodes?.[0]?.id;

    if (!episodeId) {
      throw new Error(
        `Cannot load sources for show "${show.imdbId}" season ${seasonNumber} episode ${episodeNumber}`
      );
    }

    const sources = await Promise.all([
      this.parseInfrazSources(episodeId, episodeData),
      this.parseWarezSources(episodeId, episodeData),
    ]).then((res) => {
      return res.reduce((acc: any, val: any) => [...acc, ...val], []);
    });

    return {
      sources,
    };
  }

  private async parseInfrazSources(
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
      },
    ];
  }

  private async parseWarezSources(
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
    }));
  }
}
