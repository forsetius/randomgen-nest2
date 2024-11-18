export function round(value: number, decimalPlaces = 0): number {
  const scale = Math.pow(10, decimalPlaces);
  return Math.round(value * scale) / scale;
}

export function toBigInt(value: number | bigint): bigint {
  return typeof value === 'bigint' ? value : BigInt(value);
}
