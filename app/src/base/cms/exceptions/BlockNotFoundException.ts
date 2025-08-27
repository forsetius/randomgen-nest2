import { Lang } from '@shared/types/Lang';

export class BlockNotFoundException extends Error {
  public constructor(blockId: string, pageSlug: string, lang: Lang) {
    super(`Block ${blockId} found on page : ${pageSlug} in "${lang}" library`);
  }
}
