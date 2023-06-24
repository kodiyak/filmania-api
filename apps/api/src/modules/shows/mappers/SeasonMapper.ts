export class SeasonMapper {
  public static toListPresentation({ seasonNumber }: { seasonNumber: number }) {
    return {
      number: seasonNumber,
    };
  }
}
