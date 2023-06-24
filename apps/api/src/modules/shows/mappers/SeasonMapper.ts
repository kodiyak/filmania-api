export class SeasonMapper {
  public static toListPresentation({
    seasonNumber,
    showSlug,
  }: {
    seasonNumber: number;
    showSlug: string;
  }) {
    return {
      showSlug,
      number: seasonNumber,
    };
  }
}
