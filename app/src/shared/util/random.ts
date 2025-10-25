/**
 * Roll a n-sided die
 *
 * @param n number of sides on the die
 * @returns random integer between 1 and n (inclusive)
 */
export function roll(n: number): number {
  return Math.floor(Math.random() * n) + 1;
}

/**
 * Flip a coin
 *
 * @returns true for heads, false for tails
 */
export function flipCoin(): boolean {
  return Math.random() >= 0.5;
}

/**
 * Shuffle the elements of the array
 *
 * Does not modify the original array
 *
 * @param originalArray array to shuffle
 * @returns shuffled copy of source array
 */
export function shuffle<T>(originalArray: T[]): T[] {
  const arr = Array.from(originalArray);

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }

  return arr;
}

/**
 * Pick a random element from an array
 */
export function pickRandomly<T>(arr: T[]): T {
  if (arr.length === 0) {
    throw new Error('Passed array must have at least 1 element');
  }

  return arr[roll(arr.length) - 1]!;
}
