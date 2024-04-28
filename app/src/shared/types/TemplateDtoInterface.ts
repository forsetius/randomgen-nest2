export interface TemplateDtoInterface {
  parts: TemplatePart;
  data?: Record<string, unknown>;
}

export interface TemplatePart {
  subject?: string;
  body: string;
}
