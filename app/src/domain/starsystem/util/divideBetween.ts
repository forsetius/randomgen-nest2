const MAX_RANDOM_CHUNK = 2 ** 52;
const MAX_RANDOM_SAFE_INTEGER = BigInt(MAX_RANDOM_CHUNK - 1);
const RANDOM_CHUNK_BITS = 52n;

export class DivideBetweenImpossibleError<
  T extends number | bigint,
> extends Error {
  public constructor(
    public readonly dividend: T,
    public readonly partCount: number,
    public readonly minimum?: T,
    message?: string,
  ) {
    super(
      message ??
        `Cannot divide ${String(dividend)} into ${String(partCount)} distinct parts` +
          (minimum === undefined ? '' : ` with minimum ${String(minimum)}`),
    );

    this.name = 'DivideBetweenImpossibleError';
  }
}

export function divideBetween<T extends number | bigint>(
  dividend: T,
  partCount: number,
  minimum?: T,
): T[] {
  validatePartCount(dividend, partCount, minimum);

  if (typeof dividend === 'number') {
    return divideBetweenNumbers(dividend, partCount, minimum as number | undefined) as T[];
  }

  return divideBetweenBigInts(dividend, partCount, minimum as bigint | undefined) as T[];
}

function validatePartCount<T extends number | bigint>(
  dividend: T,
  partCount: number,
  minimum?: T,
): void {
  if (!Number.isInteger(partCount) || partCount < 1) {
    throw new DivideBetweenImpossibleError(
      dividend,
      partCount,
      minimum,
      `Cannot divide ${String(dividend)} into ${String(partCount)} parts because partCount must be a positive integer`,
    );
  }
}

function divideBetweenNumbers(
  dividend: number,
  partCount: number,
  minimum?: number,
): number[] {
  if (!Number.isFinite(dividend) || dividend <= 0) {
    throw new DivideBetweenImpossibleError(
      dividend,
      partCount,
      minimum,
      `Cannot divide ${String(dividend)} because the dividend must be a finite positive number`,
    );
  }

  if (minimum !== undefined && (!Number.isFinite(minimum) || minimum <= 0)) {
    throw new DivideBetweenImpossibleError(
      dividend,
      partCount,
      minimum,
      `Cannot divide ${String(dividend)} because the minimum must be a finite positive number`,
    );
  }

  if (partCount === 1) {
    if (minimum !== undefined && dividend < minimum) {
      throw new DivideBetweenImpossibleError(
        dividend,
        partCount,
        minimum,
        `Cannot divide ${String(dividend)} into a single part that satisfies minimum ${String(minimum)}`,
      );
    }

    return [dividend];
  }

  const effectiveMinimum = minimum ?? 0;
  const minimumBudget = effectiveMinimum * partCount;

  if (minimumBudget >= dividend) {
    throw new DivideBetweenImpossibleError(
      dividend,
      partCount,
      minimum,
      `Cannot divide ${String(dividend)} into ${String(partCount)} distinct parts within the available budget`,
    );
  }

  const distributableBudget = dividend - minimumBudget;
  const weights = shuffleValues(
    Array.from({ length: partCount }, (_, index) => index + 1),
  ).map((rank) => rank + Math.random());
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const parts = weights.map(
    (weight) => effectiveMinimum + (distributableBudget * weight) / totalWeight,
  );

  const total = parts.reduce((sum, part) => sum + part, 0);

  if (total > dividend) {
    const largestPartIndex = getLargestPartIndex(parts);
    parts[largestPartIndex]! -= total - dividend;
  }

  if (parts.some((part) => part <= effectiveMinimum)) {
    throw new DivideBetweenImpossibleError(
      dividend,
      partCount,
      minimum,
      `Cannot represent ${String(partCount)} distinct number parts for dividend ${String(dividend)}`,
    );
  }

  if (new Set(parts).size !== parts.length) {
    throw new DivideBetweenImpossibleError(
      dividend,
      partCount,
      minimum,
      `Cannot represent ${String(partCount)} distinct number parts for dividend ${String(dividend)}`,
    );
  }

  return parts;
}

function divideBetweenBigInts(
  dividend: bigint,
  partCount: number,
  minimum?: bigint,
): bigint[] {
  if (dividend <= 0n) {
    throw new DivideBetweenImpossibleError(
      dividend,
      partCount,
      minimum,
      `Cannot divide ${String(dividend)} because the dividend must be a positive bigint`,
    );
  }

  if (minimum !== undefined && minimum <= 0n) {
    throw new DivideBetweenImpossibleError(
      dividend,
      partCount,
      minimum,
      `Cannot divide ${String(dividend)} because the minimum must be a positive bigint`,
    );
  }

  const effectiveMinimum = minimum ?? 1n;

  if (partCount === 1) {
    if (dividend < effectiveMinimum) {
      throw new DivideBetweenImpossibleError(
        dividend,
        partCount,
        minimum,
        `Cannot divide ${String(dividend)} into a single part that satisfies minimum ${String(effectiveMinimum)}`,
      );
    }

    return [dividend];
  }

  const partCountAsBigInt = BigInt(partCount);
  const distinctnessBudget = (partCountAsBigInt * BigInt(partCount - 1)) / 2n;
  const minimumRequired = effectiveMinimum * partCountAsBigInt + distinctnessBudget;

  if (minimumRequired > dividend) {
    throw new DivideBetweenImpossibleError(
      dividend,
      partCount,
      minimum,
      `Cannot divide ${String(dividend)} into ${String(partCount)} distinct bigint parts within the available budget`,
    );
  }

  const gapAdditions: bigint[] = Array.from({ length: partCount }, () => 0n);
  let remainingBudget = dividend - minimumRequired;

  for (let gapIndex = 0; gapIndex < partCount; gapIndex += 1) {
    const weight = BigInt(partCount - gapIndex);
    const maxAddition = remainingBudget / weight;

    if (maxAddition === 0n) {
      continue;
    }

    const addition = getRandomBigInt(maxAddition);
    gapAdditions[gapIndex] = addition;
    remainingBudget -= addition * weight;
  }

  let cumulativeAddition = 0n;
  const sortedParts: bigint[] = [];

  for (let gapIndex = 0; gapIndex < partCount; gapIndex += 1) {
    cumulativeAddition += gapAdditions[gapIndex]!;
    sortedParts.push(
      effectiveMinimum + BigInt(gapIndex) + cumulativeAddition,
    );
  }

  sortedParts[sortedParts.length - 1]! += remainingBudget;

  return shuffleValues(sortedParts);
}

function getLargestPartIndex(parts: readonly number[]): number {
  let largestPartIndex = 0;

  for (let index = 1; index < parts.length; index += 1) {
    if (parts[index]! > parts[largestPartIndex]!) {
      largestPartIndex = index;
    }
  }

  return largestPartIndex;
}

function shuffleValues<T>(values: readonly T[]): T[] {
  const shuffledValues = [...values];

  for (
    let currentIndex = shuffledValues.length - 1;
    currentIndex > 0;
    currentIndex -= 1
  ) {
    const swapIndex = Math.floor(Math.random() * (currentIndex + 1));
    const currentValue = shuffledValues[currentIndex]!;
    shuffledValues[currentIndex] = shuffledValues[swapIndex]!;
    shuffledValues[swapIndex] = currentValue;
  }

  return shuffledValues;
}

function getRandomBigInt(maxInclusive: bigint): bigint {
  if (maxInclusive <= MAX_RANDOM_SAFE_INTEGER) {
    return BigInt(Math.floor(Math.random() * (Number(maxInclusive) + 1)));
  }

  const bitLength = maxInclusive.toString(2).length;
  const chunkCount = Math.ceil(bitLength / Number(RANDOM_CHUNK_BITS));

  for (;;) {
    let candidate = 0n;

    for (let chunkIndex = 0; chunkIndex < chunkCount; chunkIndex += 1) {
      const randomChunk = BigInt(Math.floor(Math.random() * MAX_RANDOM_CHUNK));
      candidate = (candidate << RANDOM_CHUNK_BITS) + randomChunk;
    }

    const excessBits = BigInt(chunkCount * Number(RANDOM_CHUNK_BITS) - bitLength);

    if (excessBits > 0n) {
      candidate >>= excessBits;
    }

    if (candidate <= maxInclusive) {
      return candidate;
    }
  }
}
