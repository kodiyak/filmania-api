import { Request, Response } from "express";

export function onRequestErrorHandle(req: Request, res: Response, error: any) {
  return res.status(500).json({
    error: `${error?.message}`,
    stack: error.stack,
  });
}
