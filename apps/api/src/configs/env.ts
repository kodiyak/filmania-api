require("dotenv").config();

export const envConfig = {
  isDev: process.env.NODE_ENV === "development",
  port: process.env.PORT,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
};
