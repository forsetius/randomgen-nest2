import { join } from 'node:path';
import { cwd } from 'node:process';
import fs from 'node:fs';
import { Lang } from '@shared/types/Lang';

export class Locale {
  public readonly translations: Record<string, string>;

  /**
   * @throws Error if the translation file is invalid
   */
  public constructor(public readonly lang: Lang) {
    const filename = join(cwd(), 'content', 'cms', lang, 'translations.json');
    try {
      this.translations = this.validateTranslation(
        JSON.parse(fs.readFileSync(filename, 'utf-8')),
      );
    } catch (e) {
      throw new Error(
        e instanceof Error
          ? `${e.message} in ${filename}`
          : `Nonexistent or invalid translation file ${filename}`,
      );
    }
  }

  private validateTranslation(translations: unknown): Record<string, string> {
    if (
      typeof translations !== 'object' ||
      translations === null ||
      !Object.values(translations).every(
        (translation) => typeof translation === 'string',
      )
    ) {
      throw new Error();
    }

    return translations as Record<string, string>;
  }

  /**
   * @throws Error if the translation is not found
   */
  public translate(term: string): string {
    if (!(term in this.translations)) {
      throw new Error(
        `No translation found for ${term} in ${this.lang} language.`,
      );
    }

    return this.translations[term]!;
  }
}
