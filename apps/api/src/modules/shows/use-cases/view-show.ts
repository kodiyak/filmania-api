import { ViewShowQuery } from "../queries/view-show.query";
import { db } from "@/lib/db";

export class ViewShow {
  constructor() {}

  public async view(command: ViewShowQuery) {
    const { slug } = command.props;

    const show = await db.show.findFirstOrThrow({
      where: { slug },
      include: {
        seasons: {
          include: {
            episodes: true,
          },
        },
      },
    });

    return {
      show,
    };
  }
}
