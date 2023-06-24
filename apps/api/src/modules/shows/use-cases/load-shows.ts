import { Prisma } from "@prisma/client";
import { LoadShowsQuery } from "../queries/load-shows.query";
import { db } from "@/lib/db";
import { ShowMapper } from "../mappers/ShowMapper";
import kebabCase from "lodash.kebabcase";
import { ApplicationService } from "@/modules/shared/services/app.service";

export class LoadShows {
  constructor(private readonly app: ApplicationService) {}

  public async load(command: LoadShowsQuery) {
    const { limit = 20, page = 1, query, type } = command.props;

    const where: Prisma.ShowWhereInput = {};

    if (query) {
      where.OR = [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: kebabCase(query),
            mode: "insensitive",
          },
        },
      ];
    }

    if (type) {
      where.type = type;
    }

    const shows = await db.show
      .findMany({
        take: limit,
        skip: (page - 1) * limit,
        where,
        include: {
          seasons: {
            select: {
              _count: {
                select: {
                  episodes: true,
                },
              },
            },
          },
        },
      })
      .then((shows) => {
        return shows.map((show) => {
          return ShowMapper.toListPresentation({
            slug: show.slug,
            title: show.name,
            runtime: show.runtime,
            type: show.type,
            poster: this.app.withStreamUrl(`/${show.slug}/posters.webp`),
            seasonsCount:
              show.type !== "movie" ? show.seasons.length : undefined,
            episodesCount:
              show.type !== "movie"
                ? show.seasons.reduce((acc, season) => {
                    return acc + season._count.episodes;
                  }, 0)
                : undefined,
          });
        });
      });

    const totalItems = await db.show.count({
      where,
    });

    return {
      shows,
      meta: {
        total: totalItems,
        totalPages: Math.ceil(totalItems / limit),
        page,
        limit,
      },
    };
  }
}
