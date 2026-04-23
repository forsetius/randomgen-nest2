export const Lang = {
  EN: 'en',
  PL: 'pl',
} as const;

export type Lang = (typeof Lang)[keyof typeof Lang];

export const Langs = [Lang.EN, Lang.PL] as const;
