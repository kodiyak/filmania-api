import { redisConnection } from "@/configs/connections";
import { logger } from "@/lib/logger";
import Bull from "bull";
import { db } from "@/lib/db";
import kebabCase from "lodash.kebabcase";

type JobProps = {};

export const sync_shows_slugs = new Bull<JobProps>("sync_shows_slugs", {
  redis: redisConnection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
    repeat: {
      cron: "*/10 * * * *",
    },
  },
});

sync_shows_slugs.process(async (job, done) => {
  const {} = job.data;

  try {
    // await db.$transaction(async (trx) => {
    //   Your database transaction
    // });

    const shows = await db.show.findMany({
      where: {
        slug: null,
      },
    });

    for (const show of shows) {
      const slug = kebabCase(show.name);
      await db.show.update({
        where: { id: show.id },
        data: { slug },
      });
    }

    logger.info(`Slugs Job Successfully`);
    done(null, { success: true });
  } catch (error) {
    logger.error(`Job Error: ${error.message}`);
    done(error, null);
  }
});
