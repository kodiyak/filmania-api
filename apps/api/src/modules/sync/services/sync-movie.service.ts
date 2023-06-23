import { db } from "@/lib/db";
import { ShowsApi } from "@/modules/shared/services/api/shows.api";
import {
  IShowsApi,
  IShowsMovieApi,
} from "@/modules/shared/services/contracts/shows.api.interfaces";
import { Show } from "@prisma/client";
import kebabCase from "lodash.kebabcase";

export class SyncMovieService {
  constructor(private readonly showsApi: ShowsApi) {}

  public async byImdbId(imdbId: string) {
    const data = await this.showsApi.getShowMovieByImdbId(imdbId);

    if (!data.infraz && !data.warez) {
      throw new Error("No data found");
    }

    const show = await this.saveShow(imdbId, data);

    return {
      show: await db.show.findUniqueOrThrow({
        where: { id: show.id },
        include: {
          seasons: {
            include: {
              episodes: true,
            },
          },
        },
      }),
      data,
    };
  }

  private async saveShow(
    imdbId: string,
    data: IShowsMovieApi.Data
  ): Promise<Show> {
    const { id: showId } = await db.show
      .findFirstOrThrow({
        where: { imdbId },
        select: { id: true },
      })
      .catch(() => {
        return db.show.create({
          select: { id: true },
          data: {
            name: data.tmdb.title,
            type: "movie",
          },
        });
      });

    const show = await db.show.update({
      where: { id: showId },
      data: {
        cover: data.tmdb._images.covers[0],
        poster: data.tmdb._images.posters[0],
        runtime: data.tmdb.runtime ? data.tmdb.runtime : undefined,
        imdbId,
        tmdbId: `${data.tmdb.id}`,
        infrazId: undefined,
        rating: data.tmdb.vote_average
          ? Number(data.tmdb.vote_average)
          : undefined,
        synopsis: data.tmdb.overview,
      },
    });

    return show;
  }
}
