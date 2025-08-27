import { Lang } from '@shared/types/Lang';

export class BlockWithNoIdException extends Error {
  public constructor(pageSlug: string, lang: Lang) {
    super(`Block with no id found on page : ${pageSlug} in "${lang}" library`);
  }
}
