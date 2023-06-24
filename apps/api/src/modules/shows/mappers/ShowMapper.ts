import { Show } from "@prisma/client";

export class ShowMapper {
  public static toPresentation(
    show: Show,
    additionals?: {
      seasonCount?: number;
      episodeCount?: number;
    }
  ) {
    return {
      slug: show.slug,
      title: show.name,
      runtime: show.runtime,
      type: show.type,
      episodesCount: additionals?.episodeCount,
      seasonsCount: additionals?.seasonCount,
    };
  }
}
