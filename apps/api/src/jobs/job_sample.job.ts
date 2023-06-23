import { redisConnection } from "@/configs/connections";
import { logger } from "@/lib/logger";
import Bull from "bull";
import { db } from "@/lib/db";

type JobProps = {};

export const job_sample = new Bull<JobProps>("job_sample", {
  redis: redisConnection,
});

job_sample.process(async (job, done) => {
  const {} = job.data;

  try {
    // await db.$transaction(async (trx) => {
    //   Your database transaction
    // });

    logger.info(`Job Successfully`);
    done(null, { success: true });
  } catch (error) {
    logger.error(`Job Error`);
    done(error, null);
  }
});
