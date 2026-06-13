import {
  divideAndRoundUp,
  divideWithPrecision,
} from '../../../../src/shared/util/bigint';

describe('bigint utils', () => {
  it('divides bigints with decimal precision preserved in the result number', () => {
    expect(divideWithPrecision(1234567n, 1000000n, 1000000n)).toBe(1.234567);
  });

  it('rounds up bigint division when a remainder exists', () => {
    expect(divideAndRoundUp(10n, 3n)).toBe(4n);
    expect(divideAndRoundUp(9n, 3n)).toBe(3n);
    expect(divideAndRoundUp(0n, 3n)).toBe(0n);
  });
});
