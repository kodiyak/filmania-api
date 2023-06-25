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
        seasons: {
          select: {
            number: true,
            episodes: {
              select: {
                number: true,
              },
            },
          },
        },
      },
    });

    const paths: string[] = [];

    for (const show of items) {
      const slugType = show.type === "movie" ? "filme" : show.type;
      const basePath = `/assistir/${slugType}/${show.slug}`;
      paths.push(basePath);

      for (const season of show.seasons) {
        paths.push(`${basePath}/${season.number}-temporada`);

        for (const episode of season.episodes) {
          paths.push(
            `${basePath}/${season.number}-temporada/episodio-${episode.number}`
          );
        }
      }
    }

    return {
      paths,
    };
  }
}
