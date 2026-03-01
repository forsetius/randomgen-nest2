export enum Level {
  NEGLIGIBLE = 'NEGLIGIBLE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  EXTREME = 'EXTREME',
}

export const LEVEL_WEIGHT: Record<Level, number> = {
  [Level.NEGLIGIBLE]: 0.05,
  [Level.LOW]: 0.15,
  [Level.MEDIUM]: 0.3,
  [Level.HIGH]: 0.55,
  [Level.EXTREME]: 0.85,
};
