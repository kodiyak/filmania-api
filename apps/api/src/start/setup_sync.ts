import { envConfig } from "@/configs/env";
import { sync_by_oldest } from "@/jobs/sync_by_oldest";
import { sync_by_warez_ids } from "@/jobs/sync_by_warez_ids";
import { sync_shows_slugs } from "@/jobs/sync_shows_slugs";
import { logger } from "@/lib/logger";
import Bull from "bull";

const reset = async (queue: Bull.Queue) => {
  await queue.pause();
  await queue.empty();
  await queue.clean(0);
  await queue.resume();
  logger.info(`Count [${queue.name}]: ${await queue.count()}`);
};

export default async function run() {
  // await job_sample.add({});
  await reset(sync_by_oldest);
  await reset(sync_by_warez_ids);
  await reset(sync_shows_slugs);

  await sync_by_oldest.add({});

  // if (!envConfig.isDev) {
  //   await sync_by_warez_ids.add({});
  // }

  await sync_shows_slugs.add({});
}
