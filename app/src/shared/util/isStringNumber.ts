export const isStringNumber = (value?: string) => {
  if (!value) return false;
  return !Number.isNaN(parseInt(value, 10));
};
