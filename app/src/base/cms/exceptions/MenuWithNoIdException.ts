import { Lang } from '@shared/types/Lang';

export class MenuWithNoIdException extends Error {
  public constructor(pageSlug: string, lang: Lang) {
    super(`Menu with no id found on page : ${pageSlug} in "${lang}" library`);
  }
}
