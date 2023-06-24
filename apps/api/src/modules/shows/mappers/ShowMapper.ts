export class ShowMapper {
  public static toListPresentation({
    slug,
    title,
    episodesCount,
    runtime,
    seasonsCount,
    type,
  }: {
    slug: string;
    title: string;
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
      episodesCount,
      seasonsCount,
    };
  }
}
