export const getLast = <T>(array: T[] | undefined) => {
  if (!array?.length) return undefined;

  return array[array.length - 1];
};
