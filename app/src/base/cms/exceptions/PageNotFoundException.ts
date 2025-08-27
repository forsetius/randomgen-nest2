import { Lang } from '@shared/types/Lang';

export class PageNotFoundException extends Error {
  public constructor(pageSlug: string, lang: Lang) {
    super(`No such page: ${pageSlug} in "${lang}" library`);
  }
}
