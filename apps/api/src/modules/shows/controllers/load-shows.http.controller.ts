import { onRequestErrorHandle } from "@/http/errors/onRequestError";
import { RequestHandler } from "express";
import { LoadShowsQuery } from "../queries/load-shows.query";
import { LoadShows } from "../use-cases/load-shows";

export class LoadShowsHttpController {
  constructor(private readonly loadShows: LoadShows) {}

  public load: RequestHandler = async (req, res) => {
    try {
      const {} = req.params;
      const {} = req.body;
      const { page, limit, query, type } = req.query;
      const command = new LoadShowsQuery({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        query: query as string,
        type: type as string,
      });

      const result = await this.loadShows.load(command);

      res.json({
        data: result,
      });
    } catch (error) {
      onRequestErrorHandle(req, res, error);
    }
  };
}
