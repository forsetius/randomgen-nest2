export const isRecord = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value) as object | null;

  return prototype === Object.prototype || prototype === null;
};

export const isStringNumber = (value?: string) => {
  if (typeof value !== 'string') return false;

  const trimmed = value.trim();
  if (!trimmed) return false;

  return !Number.isNaN(Number(trimmed));
};

export function throwOnUndefined<T>(
  value: T | undefined,
  error: Error,
): T | never {
  if (typeof value === 'undefined') throw error;

  return value;
}
