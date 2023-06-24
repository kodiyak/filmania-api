import { redisConnection } from "@/configs/connections";
import { logger } from "@/lib/logger";
import Bull from "bull";
import { db } from "@/lib/db";
import { makeSyncMovieService, makeSyncSerieService } from "@/modules/sync";

type JobProps = {};

export const sync_by_oldest = new Bull<JobProps>("sync_by_oldest", {
  redis: redisConnection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
    repeat: {
      every: 1000 * 5,
      // limit: 1,
    },
  },
});

sync_by_oldest.process(async (job, done) => {
  const {} = job.data;

  try {
    // await db.$transaction(async (trx) => {
    //   Your database transaction
    // });

    const lastUpdatedShow = await db.show.findFirstOrThrow({
      where: {
        rating: {
          not: null,
        },
      },
      orderBy: [{ updatedAt: "asc" }],
    });

    logger.info(`Show Resyncing: "${lastUpdatedShow.name}"`);

    await db.show.update({
      where: { id: lastUpdatedShow.id },
      data: { updatedAt: new Date() },
    });

    if (lastUpdatedShow.type === "movie") {
      await makeSyncMovieService().byImdbId(lastUpdatedShow.imdbId);
    } else {
      await makeSyncSerieService().byImdbId(lastUpdatedShow.imdbId);
    }

    logger.info(`Show Resynced Successfully: "${lastUpdatedShow.name}"`);
    done(null, { success: true });
  } catch (error) {
    logger.error(`Job Error: ${error.message}`);
    done(error, null);
  }
});
