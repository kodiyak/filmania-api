import { redisConnection } from "@/configs/connections";
import { logger } from "@/lib/logger";
import Bull from "bull";
import { db } from "@/lib/db";
import { makeTmdbApi, makeWarezApi } from "@/modules/shared";
import { makeSyncMovieService, makeSyncSerieService } from "@/modules/sync";

type JobProps = {};

const memoryData = {
  warezIds: [] as string[],
};

const tmdbApi = makeTmdbApi();

export const sync_by_warez_ids = new Bull<JobProps>("sync_by_warez_ids", {
  redis: redisConnection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
    repeat: {
      cron: "* * * * *",
    },
  },
});

sync_by_warez_ids.process(20, async (job, done) => {
  const {} = job.data;

  try {
    // await db.$transaction(async (trx) => {
    //   Your database transaction
    // });
    const warezIds = await makeWarezApi().getAllIds();
    const warezId = warezIds[0];
    const dbWarezIds = await db.show
      .findMany({
        select: {
          imdbId: true,
        },
      })
      .then((res) => res.map((show) => show.imdbId));

    const warezIdsToInsert = warezIds.filter(
      (warezId) =>
        !dbWarezIds.includes(warezId) && !memoryData.warezIds.includes(warezId)
    );
    const nextWarezIds = warezIdsToInsert.slice(0, 10);
    const nextWarezId = warezIdsToInsert[0];
    memoryData.warezIds.push(nextWarezId);

    const { media_type, name, original_name } = await tmdbApi.findByImdb(
      nextWarezId
    );

    // logger.info(dbWarezIds);
    logger.info(`[${nextWarezId}] ------------------------`);
    // logger.info(`Next IDs: ${nextWarezIds.join(", ")}`);
    // logger.info(`Warez DB IDs: ${dbWarezIds.length} `);
    logger.info(`Warez IDs To Insert: ${warezIdsToInsert.length}`);
    logger.info(`Warez ID: ${nextWarezId}`);
    // logger.info(`Media Type: ${media_type}`);

    if (media_type === "tv") {
      await makeSyncSerieService().byImdbId(nextWarezId);
    } else {
      await makeSyncMovieService().byImdbId(nextWarezId);
    }

    memoryData.warezIds = memoryData.warezIds.filter(
      (warezId) => warezId !== nextWarezId
    );

    logger.info(`Warez "${name || original_name || nextWarezId}" Finished`);
    logger.info(`[${nextWarezId}] ------------------------`);

    done(null, { success: true });
  } catch (error) {
    logger.error(`Job Error: ${error.message}`);
    logger.error(`${error.stack}`);
    done(error, null);
  }
});
