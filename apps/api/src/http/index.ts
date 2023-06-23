import cors from "cors";
import express, { Router } from "express";
import { listAsync } from "fs-jetpack";
import path from "path";
import { envConfig } from "../configs/env";
import { logger } from "../lib/logger";
import { importFolder } from "@/utils/importFolder";

console.log({ envConfig });

async function loadRoutes(router: Router) {
  const dirs = await listAsync(path.resolve(__dirname, "routes"));
  if (!dirs) return;
  await Promise.all(
    dirs.map(async (dirname) => {
      const nextRouter = Router();
      console.log("router[loaded]", dirname);
      await import(path.resolve(__dirname, "routes", dirname)).then((v) =>
        v.default(nextRouter)
      );
      router.use(`/${dirname}`, nextRouter);
    })
  );
}

async function initServer() {
  const app = express();
  const router = Router();

  console.log(path.resolve(__dirname, "..", "start"));

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use("/api", router);
  await loadRoutes(router);

  app.listen(envConfig.port, async () => {
    logger.info(`API listening at http://localhost:${envConfig.port}`);

    await importFolder(
      path.resolve(__dirname, "..", "start"),
      async ({ file, m }) => {
        logger.info(`starting[${file.name}]`);
        await m.default();
        logger.info(`started[${file.name}]`);
      }
    );
  });
}

initServer();
