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
