import path from 'node:path';
import fs from 'node:fs/promises';
import { Injectable } from '@nestjs/common';
import YAML from 'yaml';

@Injectable()
export class ParserService {
  private supports = ['.json', '.md', '.yaml', '.yml'];

  isSupported(filename: string): boolean {
    return this.supports.includes(path.extname(filename));
  }

  public async parseFile(filename: string): Promise<unknown> {
    const extension = path.extname(filename);
    const fileContent = await fs.readFile(filename, { encoding: 'utf8' });
    switch (extension) {
      case '.json':
        return JSON.parse(fileContent);
      case '.md': {
        const data = /^---(?<frontmatter>.*?)---(?<content>.*)$/msu.exec(
          fileContent,
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
          content: fileContent,
        };
      }
      case '.yaml':
      case '.yml':
        return YAML.parse(fileContent);
      default:
        throw new Error('Unsupported extension');
    }
  }
}
