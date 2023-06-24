export class EpisodeMapper {
  public static toListPresentation({
    episodeNumber,
    seasonNumber,
    airDate,
    name,
    poster,
  }: {
    episodeNumber: number;
    seasonNumber: number;
    showTitle: string;
    showSlug: string;
    poster?: string;
    name?: string;
    airDate?: Date;
  }) {
    return {
      episode: episodeNumber,
      season: seasonNumber,
      poster,
      name,
      airDate,
    };
  }
}
