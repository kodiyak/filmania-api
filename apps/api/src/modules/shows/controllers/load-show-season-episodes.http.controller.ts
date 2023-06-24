import { onRequestErrorHandle } from "@/http/errors/onRequestError";
import { RequestHandler } from "express";
import { LoadShowSeasonEpisodes } from "../use-cases/load-show-season-episodes";
import { LoadShowSeasonEpisodesQuery } from "../queries/load-show-season-episodes.query";

export class LoadShowSeasonEpisodesHttpController {
  constructor(
    private readonly loadShowSeasonEpisodes: LoadShowSeasonEpisodes
  ) {}

  public load: RequestHandler = async (req, res) => {
    try {
      const { slug, season } = req.params;
      const { page, limit, sort, number, range } = req.query;
      const command = new LoadShowSeasonEpisodesQuery({
        slug,
        season: Number(season),
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        sort: sort ? (sort as any) : undefined,
        number: number ? Number(number) : undefined,
        range: range ? (range as string).split(",") : undefined,
      });

      const result = await this.loadShowSeasonEpisodes.load(command);

      res.json({
        data: result,
      });
    } catch (error) {
      onRequestErrorHandle(req, res, error);
    }
  };
}
