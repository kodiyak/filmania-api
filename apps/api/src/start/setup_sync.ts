import { envConfig } from "@/configs/env";
import { sync_by_warez_ids } from "@/jobs/sync_by_warez_ids";
import { sync_shows_slugs } from "@/jobs/sync_shows_slugs";
import { logger } from "@/lib/logger";

export default async function run() {
  // await job_sample.add({});
  const counts = Array.from({ length: 20 });
  for (const i of counts) {
    await sync_by_warez_ids.pause();
    await sync_by_warez_ids.empty();
    await sync_by_warez_ids.clean(0);
    await sync_by_warez_ids.resume();
    logger.info(`Count: ${await sync_by_warez_ids.count()}`);
  }

  // if (!envConfig.isDev) {
  //   await sync_by_warez_ids.add({});
  // }

  await sync_shows_slugs.add({});
}
