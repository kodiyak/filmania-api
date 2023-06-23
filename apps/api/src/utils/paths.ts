import { resolve } from "path";

export const inTmpPath = (...paths: string[]) => {
  return resolve(__dirname, "..", "..", "tmp", ...paths);
};
