import { onRequestErrorHandle } from "@/http/errors/onRequestError";
import { makeSyncSerieService } from "@/modules/sync";
import { Request, Response } from "express";

export async function hello(req: Request, res: Response) {
  try {
    // const data = await new ShowsApi().getShowByImdbId("tt8421350");
    // const warezIds = await makeWarezApi().getAllIds();
    const data = await makeSyncSerieService().byImdbId("tt8421350");
    res.json({
      // warezIds: warezIds.length,
      data,
    });
  } catch (error) {
    return onRequestErrorHandle(req, res, error);
  }
}
