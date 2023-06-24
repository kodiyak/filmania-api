export class ShowMapper {
  public static toListPresentation({
    slug,
    title,
    episodesCount,
    runtime,
    seasonsCount,
    type,
    poster,
  }: {
    slug: string;
    title: string;
    poster: string;
    runtime?: number;
    type?: string;
    episodesCount?: number;
    seasonsCount?: number;
  }) {
    return {
      slug,
      title,
      runtime,
      type,
      poster,
      episodesCount,
      seasonsCount,
    };
  }
}
