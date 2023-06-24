import { onRequestErrorHandle } from "@/http/errors/onRequestError";
import { RequestHandler } from "express";
import { LoadShowSeasons } from "../use-cases/load-show-seasons";
import { LoadShowSeasonsQuery } from "../queries/load-show-seasons.query";

export class LoadShowSeasonsHttpController {
  constructor(private readonly loadShowSeasons: LoadShowSeasons) {}

  public load: RequestHandler = async (req, res) => {
    try {
      const { slug } = req.params;
      const { maxEpisodes } = req.query;
      const command = new LoadShowSeasonsQuery({
        slug,
        maxEpisodes: maxEpisodes ? parseInt(maxEpisodes as string) : undefined,
      });

      const result = await this.loadShowSeasons.load(command);

      res.json({
        data: result,
      });
    } catch (error) {
      onRequestErrorHandle(req, res, error);
    }
  };
}
