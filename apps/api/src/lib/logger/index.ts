import { envConfig } from "@/configs/env";
import pino from "pino";

export const logger = pino(
  envConfig.isDev
    ? {
        transport: {
          target: "pino-pretty",
        },
      }
    : undefined
);
