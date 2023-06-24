import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { ShowsApi } from "@/modules/shared/services/api/shows.api";
import { TmdbApi } from "@/modules/shared/services/api/tmdb.api";
import { IShowsApi } from "@/modules/shared/services/contracts/shows.api.interfaces";
import { Episode, Season, Show } from "@prisma/client";
import { Collection } from "collect.js";
import kebabCase from "lodash.kebabcase";

export class SyncSerieService {
  constructor(
    private readonly showsApi: ShowsApi,
    private readonly tmdbApi: TmdbApi
  ) {}

  public async byImdbId(imdbId: string) {
    const data = await this.showsApi.getShowByImdbId(imdbId);

    if (!data.infraz && !data.warez) {
      throw new Error("No data found");
    }

    const show = await this.saveShow(imdbId, data);
    await this.saveSeasons(show.id, data);

    const seasons = await db.season.findMany({
      where: { showId: show.id },
      select: { id: true },
    });

    logger.info(`Show ${show.name}: ${seasons.length} seasons`);

    for (const season of seasons) {
      await this.saveEpisodes(season.id, data);
    }

    return {
      show: await db.show.findUniqueOrThrow({
        where: { id: show.id },
        include: {
          seasons: {
            include: {
              episodes: true,
            },
          },
        },
      }),
      data,
    };
  }

  private async saveEpisodes(
    seasonId: string,
    data: IShowsApi.Data
  ): Promise<void> {
    const {
      number,
      show: { name },
    } = await db.season.findUniqueOrThrow({
      where: { id: seasonId },
      select: {
        number: true,
        show: {
          select: {
            name: true,
          },
        },
      },
    });

    logger.info(`Season ${number} "${name}": Saving episodes`);

    let infrazEpisodes: number[] =
      data.infraz?.episodes[`${number}`]?.map((v) => {
        return Number(v.episode_num);
      }) || [];

    const warezEpisodes =
      data.warez?.seasons
        .find((v) => v.season === number)
        ?.videos.map((v) => {
          return Number(v.name);
        }) || [];

    logger.info(
      `Season ${number} "${name}": Warez ${warezEpisodes.length} episodes`
    );
    logger.info(
      `Season ${number} "${name}": Infraz ${infrazEpisodes.length} episodes`
    );

    if (infrazEpisodes.length > warezEpisodes.length) {
      infrazEpisodes = [];
    }

    if (
      data.infraz &&
      infrazEpisodes.length <= 0 &&
      warezEpisodes.length > 0 &&
      data.infraz.episodes?.["1"]
    ) {
      infrazEpisodes = warezEpisodes
        .map((episodeNumber) => {
          return data.infraz.episodes["1"]
            ?.filter((v) => !!v)
            .find((v) => {
              return Number(v.episode_num) === episodeNumber;
            });
        })
        .filter((v) => !!v)
        .map((v) => v.episode_num)
        .filter((v) => !!v);
      logger.info(
        `Season ${number}: New Infraz ${infrazEpisodes.length} episodes`
      );
    }

    const episodes = new Collection([...warezEpisodes, ...infrazEpisodes])
      .unique()
      .toArray<number>();

    for (const episodeNumber of episodes) {
      await this.saveEpisode(seasonId, episodeNumber).catch(() => {
        logger.error(`Season ${number}: Episode ${episodeNumber} not found`);
      });
    }
  }

  private async saveEpisode(
    seasonId: string,
    episodeNumber: number
  ): Promise<Episode> {
    const { show, number: seasonNumber } = await db.season.findUniqueOrThrow({
      where: { id: seasonId },
      select: {
        number: true,
        show: {
          select: {
            imdbId: true,
            tmdbId: true,
            type: true,
          },
        },
      },
    });
    const seasonData = await this.tmdbApi.findSeason(
      show.tmdbId!,
      seasonNumber,
      "pt-BR"
    );

    if (!seasonData || !seasonData.episodes) {
      throw new Error(`Tmdb Season ${seasonNumber} not found`);
    }

    const episodeData = seasonData.episodes.find(
      (v) => v.episode_number === episodeNumber
    );

    if (!episodeData) {
      throw new Error(`Tmdb Episode ${episodeNumber} not found`);
    }

    const { id: episodeId } = await db.episode
      .findFirstOrThrow({
        where: {
          seasonId,
          number: episodeNumber,
        },
        select: { id: true },
      })
      .catch(() => {
        return db.episode.create({
          data: {
            number: episodeNumber,
            seasonId,
          },
          select: { id: true },
        });
      });

    const episode = await db.episode.update({
      where: { id: episodeId },
      data: {
        name: episodeData.name,
        airDate: episodeData.air_date
          ? new Date(episodeData.air_date)
          : undefined,
        runtime: episodeData.runtime ? Number(episodeData.runtime) : undefined,
        synopsis: episodeData.overview,
      },
    });

    return episode;
  }

  private async saveShow(imdbId: string, data: IShowsApi.Data): Promise<Show> {
    const isAnime = data.tmdb.keywords.results.find(
      (v) => kebabCase(v.name.trim()) === "anime"
    );

    const { id: showId } = await db.show
      .findFirstOrThrow({
        where: { imdbId },
        select: { id: true },
      })
      .catch(() => {
        return db.show.create({
          select: { id: true },
          data: {
            name: data.tmdb.name,
            type: isAnime ? "anime" : "serie",
          },
        });
      });

    const show = await db.show.update({
      where: { id: showId },
      data: {
        cover: data.tmdb._images.covers[0],
        poster: data.tmdb._images.posters[0],
        runtime: data.tmdb.episode_run_time?.[0]
          ? data.tmdb.episode_run_time?.[0]
          : undefined,
        imdbId,
        tmdbId: `${data.tmdb.id}`,
        infrazId: undefined,
        rating: data.tmdb.vote_average
          ? Number(data.tmdb.vote_average)
          : undefined,
        synopsis: data.tmdb.overview,
      },
    });

    return show;
  }

  private async saveSeasons(
    showId: string,
    data: IShowsApi.Data
  ): Promise<void> {
    const seasonsWarez = data.warez?.seasons.map((v) => v.season) || [];
    const seasonsInfraz =
      data.infraz?.seasons.map((v) => v.season_number) || [];

    const seasons = new Collection([...seasonsWarez, ...seasonsInfraz])
      .unique()
      .toArray<number>();

    logger.info(
      `Saving Seasons: "${
        data.tmdb.name || data.tmdb.original_name || data.tmdb.id
      }" - ${seasons.length}`
    );

    for (const seasonNumber of seasons) {
      await this.saveSeason(showId, seasonNumber, data).catch(() => {
        logger.error(`Season ${seasonNumber} not found`);
      });
    }
  }

  private async saveSeason(
    showId: string,
    seasonNumber: number,
    data: IShowsApi.Data
  ): Promise<Season> {
    const tmdbSeason = data.tmdb.seasons.find(
      (v) => v.season_number === seasonNumber
    );
    const { id: seasonId } = await db.season
      .findFirstOrThrow({
        where: {
          showId,
          number: seasonNumber,
        },
        select: { id: true },
      })
      .catch(() => {
        return db.season.create({
          data: {
            showId,
            number: seasonNumber,
          },
          select: { id: true },
        });
      });

    const season = await db.season.update({
      where: { id: seasonId },
      data: {
        airDate: new Date(tmdbSeason.air_date),
        overview: tmdbSeason.overview,
      },
    });

    return season;
  }
}
