export function divideWithPrecision(
  dividend: bigint,
  divisor: bigint,
  precisionFactor: bigint,
): number {
  return (
    Number((dividend * precisionFactor) / divisor) / Number(precisionFactor)
  );
}

export function divideAndRoundUp(dividend: bigint, divisor: bigint): bigint {
  if (dividend === 0n) {
    return 0n;
  }

  return (dividend + divisor - 1n) / divisor;
}
