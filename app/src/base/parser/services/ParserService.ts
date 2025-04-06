import path from 'node:path';
import fs from 'node:fs/promises';
import { Injectable } from '@nestjs/common';
import YAML from 'yaml';
import { MarkdownService } from './MarkdownService';

@Injectable()
export class ParserService {
  private supports = ['.json', '.md', '.yaml', '.yml'];

  constructor(private markdownService: MarkdownService) {}

  isSupported(filename: string): boolean {
    return this.supports.includes(path.extname(filename));
  }

  public async parseFile(filename: string): Promise<unknown> {
    const extension = path.extname(filename);
    const content = await fs.readFile(filename, { encoding: 'utf8' });
    switch (extension) {
      case '.json':
        return JSON.parse(content);
      case '.md': {
        const data = /^---(?<frontmatter>.*)---(?<content>.*)$/msu.exec(
          content,
        );
        if (data?.groups) {
          return {
            frontmatter: data.groups['frontmatter']
              ? (YAML.parse(data.groups['frontmatter']) as unknown)
              : {},
            content: this.markdownService.parse(data.groups['content'] ?? ''),
          };
        }

        return {
          frontmatter: {},
          content: this.markdownService.parse(content),
        };
      }
      case '.yaml':
      case '.yml':
        return YAML.parse(content);
      default:
        throw new Error('Unsupported extension');
    }
  }
}
