import { Duration } from 'luxon';
import {
  Acceleration,
  Length,
  Mass,
  Period,
  Velocity,
} from '../../../../../../src/domain/starsystem/domain/valueObjects';
import { SUN_MASS } from '../../../../../../src/domain/starsystem/domain/valueObjects/Mass';

describe('ValueObject serialization', () => {
  it('returns fractional mass conversions with six digits of precision', () => {
    const mass = new Mass(SUN_MASS);

    expect(mass.getAsEarthMass()).toBe(332976.122701);
    expect(mass.getAsJupiterMass()).toBe(1047.624064);
    expect(mass.getAsSunMass()).toBe(1);
  });

  it('creates Mass from solar masses using the same six-digit precision', () => {
    const mass = Mass.fromSunMasses(1.23456789);

    expect(mass.getAsSunMass()).toBe(1.234567);
  });

  it('serializes Mass using output precision for derived values', () => {
    const mass = new Mass(SUN_MASS);

    expect(mass.toJSON()).toEqual({
      kg: SUN_MASS.toString(),
      earthMasses: 332976.122701,
      jupiterMasses: 1047.624064,
      sunMasses: 1,
    });
    expect(JSON.stringify(mass)).toBe(
      `{"kg":"${SUN_MASS.toString()}","earthMasses":332976.122701,"jupiterMasses":1047.624064,"sunMasses":1}`,
    );
  });

  it('returns fractional length conversions with six digits of precision', () => {
    const length = new Length(2n * 149597870n);

    expect(length.getAsEarthRadii()).toBe(46962.131533);
    expect(length.getAsJupiterRadii()).toBe(4279.666146);
    expect(length.getAsSunRadii()).toBe(430.183031);
    expect(length.getAsAU()).toBe(2);
  });

  it('serializes Length using a JSON-safe structure', () => {
    const length = new Length(2n * 149597870n);

    expect(length.toJSON()).toEqual({
      value: '299195740',
      earthRadii: 46962.131533,
      jupiterRadii: 4279.666146,
      sunRadii: 430.183031,
      au: 2,
    });
    expect(JSON.stringify(length)).toBe(
      '{"value":"299195740","earthRadii":46962.131533,"jupiterRadii":4279.666146,"sunRadii":430.183031,"au":2}',
    );
  });

  it('serializes Period with the stored duration and derived values', () => {
    const period = new Period(730);

    expect(period.value.equals(Duration.fromObject({ days: 730 }))).toBe(true);
    expect(period.toJSON()).toEqual({
      value: 'P730D',
      years: 2,
      days: 730,
    });
    expect(JSON.stringify(period)).toBe(
      '{"value":"P730D","years":2,"days":730}',
    );
  });

  it('serializes Velocity with derived unit conversions', () => {
    const velocity = new Velocity(10);

    expect(velocity.toJSON()).toEqual({
      value: 10,
      kmPerHour: 36,
    });
    expect(JSON.stringify(velocity)).toBe('{"value":10,"kmPerHour":36}');
  });

  it('serializes Acceleration with derived unit conversions', () => {
    const acceleration = new Acceleration(19.6133);

    expect(acceleration.toJSON()).toEqual({
      value: 19.6133,
      earthG: 2,
    });
    expect(JSON.stringify(acceleration)).toBe('{"value":19.6133,"earthG":2}');
  });
});
