const lower = 'abcdefghijklmnopqrstuvwxyz';
const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const num = '0123456789';

export class RandomChars {
  private static sets: Charsets = {
    upperNum: `${num}${upper}`.split(''),
    alphaNum: `${num}${upper}${lower}`.split(''),
    alpha: `${lower}${upper}`.split(''),
    num: num.split(''),
  };

  public static generate(charset: keyof Charsets, length: number) {
    const charArr = RandomChars.sets[charset];

    return new Array(length)
      .fill(undefined)
      .map(() => charArr[Math.floor(Math.random() * charArr.length)])
      .join('');
  }
}

export interface Charsets {
  alpha: string[];
  alphaNum: string[];
  num: string[];
  upperNum: string[];
}
