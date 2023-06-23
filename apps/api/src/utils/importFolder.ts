import { inspectTreeAsync } from "fs-jetpack";
import { InspectTreeResult } from "fs-jetpack/types";
import { resolve } from "path";

export const importFolder = async (
  path: string,
  cb: (props: { file: InspectTreeResult; m: any }) => any | Promise<any>,
  onError?: (err: any, filename: string) => void
) => {
  const folderData = await inspectTreeAsync(path);
  // console.log({ folderData });
  if (!folderData) return;

  return Promise.all(
    folderData.children.map(async (file) => {
      return import(resolve(path, file.name))
        .then(async (m: any) => {
          // console.log("job[loaded]", name);
          await cb({ file, m });
        })
        .catch((err) => {
          onError?.(err, file.name);
        });
    })
  );
};
