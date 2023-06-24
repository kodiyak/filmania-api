import { ApplicationService } from "@/modules/shared/services/app.service";
import { ViewShowQuery } from "../queries/view-show.query";
import { db } from "@/lib/db";

export class ViewShow {
  constructor(private readonly app: ApplicationService) {}

  public async view(command: ViewShowQuery) {
    const { slug } = command.props;

    const show = await db.show.findFirstOrThrow({
      where: { slug },
    });

    return {
      show: {
        ...show,
        poster: this.app.withStreamUrl(`/${show.slug}/posters.webp`),
        cover: this.app.withStreamUrl(`/${show.slug}/backdrops.webp`),
        logo: this.app.withStreamUrl(`/${show.slug}/logos.webp`),
      },
    };
  }
}
