import { globSync, promises as fsAsync } from 'node:fs';
import * as path from 'node:path';
import { Injectable, Logger } from '@nestjs/common';
import { pMapIterable } from 'p-map';
import { AppConfigService } from '@config/AppConfigService';
import { ParserService } from './ParserService';
import { ParsedFile } from '../types/ParsedFile';

@Injectable()
export class LoaderService {
  private readonly logger = new Logger(LoaderService.name);
  private readonly concurrency: number;

  constructor(
    private readonly parser: ParserService,
    configService: AppConfigService,
  ) {
    this.concurrency = configService.get('parser.concurrency');
  }

  public getDirectoryList(directory: string, recursive = false): string[] {
    const pattern = recursive ? '**/*/' : '*/';
    return globSync(pattern, { cwd: directory });
  }

  public getFileList(
    directory: string,
    filePatterns: string | string[] = '**/*',
  ): string[] {
    const patterns = Array.isArray(filePatterns)
      ? filePatterns
      : [filePatterns];

    return globSync(patterns, { cwd: directory });
  }

  /**
   * Recursively walks a directory and yields all files found.
   *
   * Does NOT build a file array in memory.
   */
  private async *walkDirectory(directory: string): AsyncGenerator<string> {
    const dir = await fsAsync.opendir(directory);
    for await (const dirent of dir) {
      const fullPath = path.join(directory, dirent.name);

      if (dirent.isDirectory()) {
        yield* this.walkDirectory(fullPath);
        continue;
      }

      if (dirent.isFile() && this.parser.isSupported(fullPath)) {
        yield fullPath;
      }
    }
  }

  /**
   * Loads and parses all files in the given directory.
   *
   * Returns an iterable of parsed files.
   */
  public loadAndParse(directory: string): AsyncIterable<ParsedFile> {
    return pMapIterable(
      this.walkDirectory(directory),
      async (filename): Promise<ParsedFile> => {
        try {
          const data = await this.parser.parseFile(filename);

          return { filename, data };
        } catch (error) {
          this.logger.error(
            `Failed to parse file: ${filename}`,
            (error as Error).stack,
          );

          throw error;
        }
      },
      {
        concurrency: this.concurrency,
      },
    );
  }
}
