import { onRequestErrorHandle } from "@/http/errors/onRequestError";
import { makeSyncMovieService, makeSyncSerieService } from "@/modules/sync";
import { Request, Response } from "express";

export async function hello(req: Request, res: Response) {
  try {
    // const data = await new ShowsApi().getShowByImdbId("tt8421350");
    // const warezIds = await makeWarezApi().getAllIds();
    // const data = await makeSyncMovieService().byImdbId("tt1630029");
    const data = await makeSyncSerieService().byImdbId("tt21844706");
    res.json({
      // warezIds: warezIds.length,
      data,
    });
  } catch (error) {
    return onRequestErrorHandle(req, res, error);
  }
}
