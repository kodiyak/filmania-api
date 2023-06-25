import { DispatcherService } from "@/modules/shared";
import { LoadAllPathsQuery } from "../queries/load-all-paths.query";
import { db } from "@/lib/db";

export class LoadAllPaths {
  constructor() {}

  public async load(command: LoadAllPathsQuery) {
    const {} = command.props;

    const items = await db.show.findMany({
      select: {
        slug: true,
        type: true,
        updatedAt: true,
        seasons: {
          select: {
            number: true,
            updatedAt: true,
            episodes: {
              select: {
                number: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    const paths: Array<{
      url: string;
      updatedAt: Date;
    }> = [];

    for (const show of items) {
      const slugType = show.type === "movie" ? "filme" : show.type;
      const basePath = `/assistir/${slugType}/${show.slug}`;
      paths.push({
        url: basePath,
        updatedAt: show.updatedAt,
      });

      for (const season of show.seasons) {
        paths.push({
          url: `${basePath}/${season.number}-temporada`,
          updatedAt: season.updatedAt,
        });

        for (const episode of season.episodes) {
          paths.push({
            url: `${basePath}/${season.number}-temporada/episodio-${episode.number}`,
            updatedAt: episode.updatedAt,
          });
        }
      }
    }

    return {
      paths,
    };
  }
}
