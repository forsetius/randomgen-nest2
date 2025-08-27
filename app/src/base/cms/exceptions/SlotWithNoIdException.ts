import { Lang } from '@shared/types/Lang';

export class SlotWithNoIdException extends Error {
  public constructor(pageSlug: string, lang: Lang) {
    super(`Slot with no id found on page : ${pageSlug} in "${lang}" library`);
  }
}
