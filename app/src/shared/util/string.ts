export const removeWhitespace = (value: string) => {
  return value.replace(/\s/g, '');
};

export const uuidRegexp =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/;
