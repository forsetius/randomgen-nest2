import { Lang } from '@shared/types/Lang';

export class CategoryNotFoundException extends Error {
  public constructor(categoryPageSlug: string, lang: Lang, pageHint?: string) {
    const hint = pageHint
      ? `It was mentioned while processing the "${pageHint}" page`
      : 'Probably GalleryPageBlock with this category as source exists but no page hasValue been assigned to it.';

    super(
      `No such category page "${categoryPageSlug}" in "${lang}" library.
       ${hint}\n`,
    );
  }
}
