import { Lang } from '@shared/types/Lang';

export class CategoryNotFoundException extends Error {
  public constructor(categoryPageSlug: string, lang: Lang) {
    super(
      `No such category ${categoryPageSlug} in "${lang}" library.\n
       Probably GalleryPageBlock with this category as source exists but no page has been assigned to it.`,
    );
  }
}
