import { HttpService } from '@nestjs/axios';
import { TemplatingService } from '@templating/TemplatingService';
import { Locale } from '@shared/types/Locale';
import { AxiosError } from 'axios';
import { ApiCallBlockDef } from '../types';
import { InternalServerErrorException } from '@nestjs/common';
import { DynamicBlock } from './DynamicBlock';

export class ApiCallBlock extends DynamicBlock {
  public readonly dynamic = true;

  public constructor(
    private readonly httpService: HttpService,
    private readonly templatingService: TemplatingService,
    name: string,
    public override readonly def: ApiCallBlockDef,
    locale: Locale,
    public override readonly parentSlug: string,
  ) {
    super(name, def, locale, parentSlug);
  }

  public preRender(): void {
    return;
  }

  public async render(): Promise<string> {
    let data: Record<string, unknown>;
    try {
      data = (await this.httpService.axiosRef.get(this.def.url)).data as Record<
        string,
        unknown
      >;
    } catch (e: unknown) {
      const message = `Api call to ${this.def.url} failed while rendering ${this.name}`;
      throw new InternalServerErrorException(
        e instanceof AxiosError && typeof e.response !== 'undefined'
          ? `${message}.\nReason: ${e.response.status.toString()} ${e.response.statusText}`
          : message,
      );
    }

    return this.templatingService.render(this.template, data, this.locale);
  }
}
