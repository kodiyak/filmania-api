import { onRequestErrorHandle } from "@/http/errors/onRequestError";
import { RequestHandler } from "express";
import { LoadAllPaths } from "../use-cases/load-all-paths";
import { LoadAllPathsQuery } from "../queries/load-all-paths.query";

export class LoadAllPathsHttpController {
  constructor(private readonly loadAllPaths: LoadAllPaths) {}

  public load: RequestHandler = async (req, res) => {
    try {
      const {} = req.params;
      const {} = req.body;
      const command = new LoadAllPathsQuery({});

      const result = await this.loadAllPaths.load(command);

      res.json({
        data: result,
      });
    } catch (error) {
      onRequestErrorHandle(req, res, error);
    }
  };
}
