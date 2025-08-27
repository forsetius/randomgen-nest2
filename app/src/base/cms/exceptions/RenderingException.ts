import { Lang } from '@shared/types/Lang';
import { stringifyError } from '@shared/util/string';

export class RenderingException extends Error {
  public constructor(
    target: string,
    targetId: string,
    lang: Lang,
    e?: unknown,
    pageSlug?: string,
  ) {
    const page = pageSlug ? ` on page ${pageSlug}` : '';
    const error = e ? `:\n ${stringifyError(e)}` : '';
    super(
      `Error rendering ${target} "${targetId}" ${page} in "${lang}" library${error}`,
    );
  }
}
