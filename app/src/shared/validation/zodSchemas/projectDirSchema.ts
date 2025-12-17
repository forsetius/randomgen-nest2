import { z } from 'zod';
import { isInsideProject, resolveAppRelativePath } from '@shared/util/path';
import fs from 'fs';

export const projectDirSchema = z
  .string()
  .min(1)
  .transform((rawPath: string) => resolveAppRelativePath(rawPath))
  .refine((absolutePath: string) => isInsideProject(absolutePath), {
    message: 'Directory must be inside project root',
  })
  .refine(
    (absolutePath: string) => {
      try {
        fs.accessSync(absolutePath, fs.constants.R_OK);
        return fs.statSync(absolutePath).isDirectory();
      } catch {
        return false;
      }
    },
    { message: 'No such directory' },
  );
