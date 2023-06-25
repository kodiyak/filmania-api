import { ApplicationService } from "@/modules/shared/services/app.service";
import { ViewShowQuery } from "../queries/view-show.query";
import { db } from "@/lib/db";

export class ViewShow {
  constructor(private readonly app: ApplicationService) {}

  public async view(command: ViewShowQuery) {
    const { slug, type } = command.props;

    const show = await db.show.findFirstOrThrow({
      where: { slug, type },
    });

    return {
      show: {
        ...show,
        poster: this.app.withStreamUrl(
          `/${show.type}/${show.slug}/posters.webp`
        ),
        cover: this.app.withStreamUrl(
          `/${show.type}/${show.slug}/backdrops.webp`
        ),
        logo: this.app.withStreamUrl(`/${show.type}/${show.slug}/logos.webp`),
      },
    };
  }
}
