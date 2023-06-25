import { onRequestErrorHandle } from "@/http/errors/onRequestError";
import { RequestHandler } from "express";
import { LoadShowSources } from "../use-cases/load-show-sources";
import { LoadShowSourcesQuery } from "../queries/load-show-sources.query";

export class LoadShowSourcesHttpController {
  constructor(private readonly loadShowSources: LoadShowSources) {}

  public load: RequestHandler = async (req, res) => {
    try {
      const { slug, season, episode, type } = req.params;
      const {} = req.body;
      const command = new LoadShowSourcesQuery({
        slug,
        episode: episode ? parseInt(episode) : undefined,
        season: season ? parseInt(season) : undefined,
        type,
      });

      const result = await this.loadShowSources.load(command);

      res.json({
        data: result,
      });
    } catch (error) {
      onRequestErrorHandle(req, res, error);
    }
  };
}
