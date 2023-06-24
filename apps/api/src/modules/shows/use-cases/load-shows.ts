import { Prisma } from "@prisma/client";
import { LoadShowsQuery } from "../queries/load-shows.query";
import { db } from "@/lib/db";
import { ShowMapper } from "../mappers/ShowMapper";

export class LoadShows {
  constructor() {}

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
          return ShowMapper.toPresentation(show, {
            seasonCount: show.seasons.length,
            episodeCount: show.seasons.reduce((acc, season) => {
              return acc + season._count.episodes;
            }, 0),
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
