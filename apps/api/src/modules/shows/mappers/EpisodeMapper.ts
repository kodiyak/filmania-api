export class EpisodeMapper {
  public static toListPresentation({
    episodeNumber,
    airDate,
    name,
    poster,
  }: {
    episodeNumber: number;
    poster?: string;
    name?: string;
    airDate?: Date;
  }) {
    return {
      episode: episodeNumber,
      poster,
      name,
      airDate,
    };
  }
}
