import { onRequestErrorHandle } from "@/http/errors/onRequestError";
import { Request, Response } from "express";

export async function hello(req: Request, res: Response) {
  try {
    res.json({
      hello: "world",
    });
  } catch (error) {
    return onRequestErrorHandle(req, res, error);
  }
}
