import { Lang } from '@shared/types/Lang';

export class TagNotFoundException extends Error {
  public constructor(categoryPageSlug: string, lang: Lang) {
    super(`No such tag: ${categoryPageSlug} in "${lang}" library`);
  }
}
