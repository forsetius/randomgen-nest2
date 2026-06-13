import { Duration } from 'luxon';
import { ValueObject } from './ValueObject';

export class Period extends ValueObject<Duration> {
  public readonly unit = 'days';

  public constructor(days: number) {
    super(Duration.fromObject({ days }));
  }

  public getAsYears(): number {
    return this.value.as('years');
  }

  public getAsDays(): number {
    return this.value.as('days');
  }

  public getHumanized(locale: string): string {
    return this.value.reconfigure({ locale }).toHuman({ showZeros: false });
  }

  public override toJSON(): object {
    return {
      value: this.value.toJSON(),
      years: this.getAsYears(),
      days: this.getAsDays(),
    };
  }
}
