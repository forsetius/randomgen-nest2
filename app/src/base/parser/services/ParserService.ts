import path from 'node:path';
import fs from 'node:fs/promises';
import { Injectable } from '@nestjs/common';
import YAML from 'yaml';

@Injectable()
export class ParserService {
  private supportedFormats: Record<string, SupportedFormat> = {
    '.json': SupportedFormat.JSON,
    '.md': SupportedFormat.MARKDOWN,
    '.yaml': SupportedFormat.YAML,
    '.yml': SupportedFormat.YAML,
  };

  isSupported(filename: string): boolean {
    return path.extname(filename) in this.supportedFormats;
  }

  public async parseFile(filename: string): Promise<unknown> {
    const extension = path.extname(filename);
    const format = this.supportedFormats[extension];
    if (!format) throw new Error(`Unsupported file extension "${extension}"`);

    const fileContent = await fs.readFile(filename, { encoding: 'utf8' });

    return this.parseContent(fileContent, format);
  }

  public parseContent(content: string, format: SupportedFormat): unknown {
    switch (format) {
      case SupportedFormat.JSON:
        return JSON.parse(content);
      case SupportedFormat.MARKDOWN: {
        const data = /^---(?<frontmatter>.*?)---(?<content>.*)$/msu.exec(
          content,
        );
        if (data?.groups) {
          const frontmatter = data.groups['frontmatter']
            ? (YAML.parse(data.groups['frontmatter']) as Record<
                string,
                unknown
              >)
            : {};

          return {
            ...frontmatter,
            content: data.groups['content'] ?? '',
          };
        }

        return {
          frontmatter: {},
          content,
        };
      }
      case SupportedFormat.YAML:
        return YAML.parse(content);
      default:
        throw new Error('Unsupported extension');
    }
  }
}

enum SupportedFormat {
  JSON = 'json',
  MARKDOWN = 'md',
  YAML = 'yaml',
}
