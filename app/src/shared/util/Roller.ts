import { roll } from '@shared/util/random';

export function rollDice(formula: string): number {
  const n = '[1-9][0-9]*';
  const diceCountRE = `(?<diceCount>${n})`;
  const dieKindRE = `(?<dieKind>${n})`;
  const explodingRE = `(?<exploding>![<>]?(?:${n})?)?`;
  const successesRE = `(?<successes>>${n}|>=${n}|<${n}|<=${n}])?`;
  const keepDropRE = `(?<keepDrop>d${n}|k${n}|dh${n}|dl${n}|kh${n}|kl${n})?`;
  const rerollRE = `(?<reroll>r[<>]?${n})?`;
  // const re = `${diceCountRE}d${dieKindRE}${explodingRE}${rerollRE}${keepDropRE}${successesRE}`;

  const parts = new RegExp(`${diceCountRE}[dD]${dieKindRE}${restRE}?`).exec(
    formula,
  )?.groups;
  if (!parts) {
    throw new Error('Invalid dice formula');
  }

  const dieKind = parseInt(parts['dieKind']!, 10);
  let rolls: number[] = new Array(parseInt(parts['diceCount']!, 10))
    .fill(0)
    .map(() => roll(dieKind));

  let rest = parts['rest'] ?? '';
  while (rest.length > 0) {
    const char = rest.slice(0, 1);
    switch (char) {
      case '!':
        [rolls, rest] = explode(rolls, rest, dieKind);
        break;
      case 'r':
        [rolls, rest] = reroll(rolls, rest, dieKind);
        break;
      case 'd':
      case 'k':
        [rolls, rest] = keepDrop(rolls, rest);
        break;
      case '>':
      case '<':
        return countSuccesses(rolls, rest);
        break;
      case '+':
      case '-':
      case '*':
      case '/':
        return math(rolls, rest);
      default:
        rest = '';
    }
  }

  return sumRolls(rolls);
}

function sumRolls(rolls: number[]): number {
  return rolls.reduce((pv, cv) => pv + cv, 0);
}

function math(value: number, options: string): number;
function math(rolls: number[], options: string): number;
function math(rollsOrValue: number | number[], options: string): number {
  const value = Array.isArray(rollsOrValue)
    ? sumRolls(rollsOrValue)
    : rollsOrValue;

  const parts = new RegExp(
    /^(?<all>!(?<sign>[+\-*/])(?<round>[udf])?(?<n>\d+)?)/,
  ).exec(options)?.groups;
  if (!parts) {
    throw new Error('Invalid dice formula');
  }

  const n = parseInt(parts['n']!, 10);
  switch (parts['sign']!) {
    case '+':
      return value + n;
    case '-':
      return value - n;
    case '*':
      return value * n;
    case '/':
      switch (parts['round']) {
        case 'u':
          return Math.ceil(value / n);
        case 'd':
          return Math.floor(value / n);
        case 'f':
          return value / n;
        default:
          return Math.round(value / n);
      }
    default:
      throw new Error('Invalid formula');
  }
}

function explode(
  rolls: number[],
  options: string,
  dieKind: number,
): CommandResult {
  const parts = new RegExp(/^(?<all>!(?<sign>[<>]?)(?<n>\d+)?)/).exec(
    options,
  )?.groups;
  if (!parts) {
    throw new Error('Invalid dice formula');
  }

  const threshold = parseInt(parts['n'] ?? dieKind + '', 10);
  let testFn: (aRoll: number) => boolean;
  switch (parts['sign']) {
    case '<':
      testFn = (aRoll) => aRoll < threshold;
      break;
    case '>':
      testFn = (aRoll) => aRoll > threshold;
      break;
    default:
      testFn = (aRoll) => aRoll === threshold;
  }

  const explodeFn = (aRoll: number) => {
    if (testFn(aRoll)) {
      const newRoll = roll(dieKind);
      newRolls.push(newRoll);

      explodeFn(newRoll);
    }
  };

  const newRolls: number[] = [];
  rolls.forEach((aRoll) => {
    newRolls.push(aRoll);
    explodeFn(aRoll);
  });

  return [newRolls, options.slice(parts['all']!.length)];
}

function keepDrop(rolls: number[], options: string): CommandResult {
  rolls.sort((a, b) => b - a);

  const parts = new RegExp(/^(?<all>(?<command>[kd][hl]?)(?<n>\d+))/).exec(
    options,
  )?.groups;
  if (!parts) {
    throw new Error('Invalid dice formula');
  }

  const n = parseInt(parts['n']!, 10);
  const allLength = options.slice(parts['all']!.length);
  switch (parts['command']) {
    case 'k':
    case 'kh':
      return [rolls.slice(-n), allLength];
    case 'kl':
      return [rolls.slice(0, n), allLength];
    case 'd':
    case 'dl':
      return [rolls.slice(n), allLength];
    case 'dh':
      return [rolls.slice(0, -n), allLength];
    default:
      throw new Error('Invalid dice formula');
  }
}

function reroll(
  rolls: number[],
  options: string,
  dieKind: number,
): CommandResult {
  const parts = new RegExp(/^(?<all>r(?<sign>[<>])?(?<n>\d+))/).exec(
    options,
  )?.groups;
  if (!parts) {
    throw new Error('Invalid dice formula');
  }

  const n = parseInt(parts['n']!, 10);
  let rerollFn: (aRoll: number) => number;
  switch (parts['sign'] ?? '=') {
    case '<':
      rerollFn = (aRoll) => (aRoll < n ? roll(dieKind) : aRoll);
      break;
    case '>':
      rerollFn = (aRoll) => (aRoll > n ? roll(dieKind) : aRoll);
      break;
    default:
      rerollFn = (aRoll) => (aRoll === n ? roll(dieKind) : aRoll);
  }

  return [rolls.map(rerollFn), options.slice(parts['all']!.length)];
}

type CommandResult = [rolls: number[], rest: string];
