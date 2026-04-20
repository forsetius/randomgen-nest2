import fs from 'node:fs/promises';
import path from 'node:path';
import type { MarkdownApi } from '@forsetius/glitnir-markdown';
import { Inject, Injectable } from '@nestjs/common';
import YAML from 'yaml';
import { CMS_MARKDOWN_API } from '../markdown/CmsMarkdownApiToken';

@Injectable()
export class CmsSourceParserService {
  private readonly supportedExtensions = ['.json', '.md', '.yaml', '.yml'];

  public constructor(
    @Inject(CMS_MARKDOWN_API)
    private readonly markdownApi: MarkdownApi,
  ) {}

  public isSupported(filename: string): boolean {
    return this.supportedExtensions.includes(path.extname(filename));
  }

  public async parseFile(filename: string): Promise<unknown> {
    const extension = path.extname(filename);

    switch (extension) {
      case '.json': {
        const fileContent = await fs.readFile(filename, { encoding: 'utf8' });

        return JSON.parse(fileContent);
      }
      case '.md':
        return await this.markdownApi.parseFile(filename);
      case '.yaml':
      case '.yml': {
        const fileContent = await fs.readFile(filename, { encoding: 'utf8' });

        return YAML.parse(fileContent);
      }
      default:
        throw new Error('Unsupported extension');
    }
  }
}
