import { DispatcherService } from "@/modules/shared";
import { LoadShowSeasonsQuery } from "../queries/load-show-seasons.query";
import { db } from "@/lib/db";
import { SeasonMapper } from "../mappers/SeasonMapper";
import { EpisodeMapper } from "../mappers/EpisodeMapper";
import { ApplicationService } from "@/modules/shared/services/app.service";

export class LoadShowSeasons {
  constructor(private readonly app: ApplicationService) {}

  public async load(command: LoadShowSeasonsQuery) {
    const { slug, maxEpisodes } = command.props;

    const seasons = await db.season.findMany({
      where: {
        show: {
          slug,
        },
      },
      select: {
        number: true,
        episodes: {
          select: {
            number: true,
            name: true,
            airDate: true,
          },
          take: maxEpisodes,
          orderBy: {
            number: "desc",
          },
        },
      },
      orderBy: {
        number: "asc",
      },
    });

    return {
      seasons: seasons.map((season) => ({
        ...SeasonMapper.toListPresentation({ seasonNumber: season.number }),
        episodes: season.episodes.map((episode) => ({
          ...EpisodeMapper.toListPresentation({
            episodeNumber: episode.number,
            name: episode.name,
            airDate: episode.airDate,
            poster: this.app.withApiUrl(
              `/api/posters/${slug}/${season.number}/${episode.number}.webp`
            ),
          }),
        })),
      })),
    };
  }
}
