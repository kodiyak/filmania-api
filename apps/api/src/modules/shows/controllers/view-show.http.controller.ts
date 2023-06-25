import { onRequestErrorHandle } from "@/http/errors/onRequestError";
import { RequestHandler } from "express";
import { ViewShow } from "../use-cases/view-show";
import { ViewShowQuery } from "../queries/view-show.query";

export class ViewShowHttpController {
  constructor(private readonly viewShow: ViewShow) {}

  public view: RequestHandler = async (req, res) => {
    try {
      const { slug, type } = req.params;
      const command = new ViewShowQuery({ slug, type });

      const result = await this.viewShow.view(command);

      res.json({
        data: result,
      });
    } catch (error) {
      onRequestErrorHandle(req, res, error);
    }
  };
}
