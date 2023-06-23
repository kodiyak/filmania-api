import { logger } from "@/lib/logger";
import { writeAsync, readAsync, removeAsync, existsAsync } from "fs-jetpack";
import crypto from "crypto";
import { inTmpPath } from "@/utils/paths";

const toMd5 = (ref: string) => {
  return crypto.createHash("md5").update(ref).digest("hex");
};

export class CacheHelperService {
  public async saveCache(ref: string, value: string) {
    await writeAsync(inTmpPath(`${toMd5(ref)}.bin`), value);
    logger.info(`Write Cache: [${ref}]`);
  }

  public async readCache(ref: string): Promise<string | undefined> {
    // logger.info(`Read Cache: [${ref}]`);
    return readAsync(`${inTmpPath(`${toMd5(ref)}.bin`)}`, "utf8");
  }

  public async removeCache(ref: string) {
    logger.info(`Remove Cache: [${ref}]`);
    return removeAsync(`${inTmpPath(`${toMd5(ref)}.bin`)}`);
  }

  public async existsCache(ref: string): Promise<boolean> {
    const value = await existsAsync(inTmpPath(`${toMd5(ref)}.bin`));

    // logger.info(`Exists Cache: [${ref}][${!!value}]`);

    return !!value;
  }
}
