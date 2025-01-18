import { Page } from '../domain';

export interface BlockData {
  name: string;
  template: string;
  style: string;
}

export interface ApiCallBlockData extends BlockData {
  url: string;
}

export interface SinglePageBlockData extends BlockData {
  page: Omit<Page, 'blocks'>;
}

export interface MultiPageBlockData extends BlockData {
  pages: Omit<Page, 'blocks'>[];
}
