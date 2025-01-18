import { BlockDef } from './BlockDef';

export interface PageDef {
  title: string;
  subtitle?: string;
  headerImage: string;
  thumbnailImage?: string;
  excerpt?: string;
  lead?: string | undefined;
  content: string;
  blocks?: Record<string, BlockDef> | undefined;
  tags?: string[];
  template: string;
}
