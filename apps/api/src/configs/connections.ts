import { envConfig } from "./env";

export const redisConnection = {
  host: envConfig.redisHost,
  port: Number(envConfig.redisPort),
};
