import { db } from "@/lib/db";
import { LoadShowSeasonEpisodesQuery } from "../queries/load-show-season-episodes.query";
import { Prisma } from "@prisma/client";
import { EpisodeMapper } from "../mappers/EpisodeMapper";
import { ApplicationService } from "@/modules/shared/services/app.service";

export class LoadShowSeasonEpisodes {
  constructor(private readonly app: ApplicationService) {}

  public async load(command: LoadShowSeasonEpisodesQuery) {
    const {
      slug,
      type,
      season: seasonNumber,
      page = 1,
      limit = 20,
      sort = "desc",
      number,
      range,
    } = command.props;

    const show = await db.show.findFirstOrThrow({
      where: { slug, type },
      select: {
        name: true,
        type: true,
      },
    });

    const where: Prisma.EpisodeWhereInput = {
      season: {
        number: seasonNumber,
        show: {
          slug,
        },
      },
    };

    if (number) {
      where.number = number;
    }

    if (range) {
      where.number = {
        gte: Number(range[0]),
        lte: Number(range[1]),
      };
    }

    const episodes = await db.episode
      .findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          number: sort,
        },
      })
      .then((res) => {
        return res.map((episode) => {
          return EpisodeMapper.toListPresentation({
            episodeNumber: episode.number,
            seasonNumber: seasonNumber,
            showTitle: show.name,
            showSlug: slug,
            name: episode.name,
            airDate: episode.airDate,
            poster: this.app.withStreamUrl(
              `/${show.type}/${slug}/seasons/${seasonNumber}/episodes/${episode.number}/thumbnail.webp`
            ),
          });
        });
      });

    const totalItems = await db.episode.count({ where });

    return {
      episodes,
      meta: {
        page,
        limit,
        total: totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }
}
