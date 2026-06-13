import { StarSystem } from '../domain/StarSystem';
import {
  BinaryStarNode,
  SingleStarNode,
  type StarHierarchyNode,
} from '../domain/stellarHierarchy';
import { Mass } from '../domain/valueObjects';
import { MAX_STAR_MASS, MIN_STAR_MASS } from '../domain/valueObjects/Mass';
import { rollBetween, rollStarMassBetween } from '../util/rollBetween';
import { StarFactory } from './StarFactory';

type Multiplicity = 'single' | 'binary' | 'triple';
type BinaryRelation = 'close' | 'wide';
type TripleLayout = 'close-binary-primary' | 'single-primary';

const CLOSE_BINARY_EQUALITY_EXPONENT = 0.75;
const WIDE_BINARY_EQUALITY_EXPONENT = 1.6;
const OUTER_BINARY_PRIMARY_MAX_RATIO = 0.45;

export class StarHierarchyGenerator {
  public constructor(private readonly starFactory: StarFactory) {}

  public generate(): StarSystem {
    const primaryMass = this.rollPrimaryMass();
    const multiplicity = this.rollMultiplicity(primaryMass);

    if (multiplicity === 'single') {
      return new StarSystem(this.buildSingleNode(primaryMass));
    }

    if (multiplicity === 'binary') {
      const relation = this.rollBinaryRelation();

      if (relation === 'close') {
        return new StarSystem(this.buildCloseBinaryNode(primaryMass));
      }

      return new StarSystem(this.buildWideBinaryNode(primaryMass));
    }

    return new StarSystem(this.rollTripleHierarchy(primaryMass));
  }

  private rollPrimaryMass(): Mass {
    return new Mass(rollStarMassBetween(MIN_STAR_MASS, MAX_STAR_MASS));
  }

  private rollMultiplicity(primaryMass: Mass): Multiplicity {
    const unitRandom = Math.random();
    const solarMasses = primaryMass.getAsSunMass();

    if (solarMasses < 1) {
      if (unitRandom < 0.82) {
        return 'single';
      }

      if (unitRandom < 0.97) {
        return 'binary';
      }

      return 'triple';
    }

    if (solarMasses < 8) {
      if (unitRandom < 0.35) {
        return 'single';
      }

      if (unitRandom < 0.9) {
        return 'binary';
      }

      return 'triple';
    }

    if (unitRandom < 0.15) {
      return 'single';
    }

    if (unitRandom < 0.8) {
      return 'binary';
    }

    return 'triple';
  }

  private rollBinaryRelation(): BinaryRelation {
    return Math.random() < 0.5 ? 'close' : 'wide';
  }

  private rollTripleLayout(primaryMass: Mass): TripleLayout {
    if (primaryMass.getAsSunMass() < 8) {
      return 'close-binary-primary';
    }

    return Math.random() < 0.5 ? 'close-binary-primary' : 'single-primary';
  }

  private rollBinaryCompanionMass(
    primaryMass: Mass,
    relation: BinaryRelation,
  ): Mass {
    const primarySolarMasses = primaryMass.getAsSunMass();
    const minimumRatio = Number(MIN_STAR_MASS) / Number(primaryMass.value);
    const exponent =
      relation === 'close'
        ? CLOSE_BINARY_EQUALITY_EXPONENT
        : WIDE_BINARY_EQUALITY_EXPONENT;
    const massRatio = rollBetween(minimumRatio, 1, {
      strategy: 'power-law',
      exponent,
    });

    return this.clampToMinimumStarMass(
      Mass.fromSunMasses(primarySolarMasses * massRatio),
    );
  }

  private rollWideCompanionMass(primaryMass: Mass): Mass {
    return this.rollBinaryCompanionMass(primaryMass, 'wide');
  }

  private rollTripleHierarchy(primaryMass: Mass): StarHierarchyNode {
    const tripleLayout = this.rollTripleLayout(primaryMass);

    if (tripleLayout === 'single-primary') {
      return this.buildWideSinglePlusBinaryNode(primaryMass);
    }

    return this.buildWideBinaryPlusSingleNode(primaryMass);
  }

  private buildSingleNode(primaryMass: Mass): SingleStarNode {
    return new SingleStarNode(
      this.starFactory.createStar({
        mass: primaryMass,
      }),
    );
  }

  private buildCloseBinaryNode(primaryMass: Mass): BinaryStarNode {
    const companionMass = this.rollBinaryCompanionMass(primaryMass, 'close');

    return new BinaryStarNode(
      this.buildSingleNode(primaryMass),
      this.buildSingleNode(companionMass),
      'close',
    );
  }

  private buildWideBinaryNode(primaryMass: Mass): BinaryStarNode {
    const companionMass = this.rollWideCompanionMass(primaryMass);

    return new BinaryStarNode(
      this.buildSingleNode(primaryMass),
      this.buildSingleNode(companionMass),
      'wide',
    );
  }

  private buildWideBinaryPlusSingleNode(primaryMass: Mass): BinaryStarNode {
    const closeBinary = this.buildCloseBinaryNode(primaryMass);
    const outerSingleMass = this.rollWideCompanionMass(closeBinary.mass);

    return new BinaryStarNode(
      closeBinary,
      this.buildSingleNode(outerSingleMass),
      'wide',
    );
  }

  private buildWideSinglePlusBinaryNode(primaryMass: Mass): BinaryStarNode {
    const outerPrimarySolarMass =
      primaryMass.getAsSunMass() *
      rollBetween(
        Number(MIN_STAR_MASS) / Number(primaryMass.value),
        OUTER_BINARY_PRIMARY_MAX_RATIO,
        {
          strategy: 'power-law',
          exponent: WIDE_BINARY_EQUALITY_EXPONENT,
        },
      );
    const outerPrimaryMass = this.clampToMinimumStarMass(
      Mass.fromSunMasses(outerPrimarySolarMass),
    );
    const outerBinary = this.buildCloseBinaryNode(outerPrimaryMass);

    return new BinaryStarNode(
      this.buildSingleNode(primaryMass),
      outerBinary,
      'wide',
    );
  }

  private clampToMinimumStarMass(mass: Mass): Mass {
    if (mass.value < MIN_STAR_MASS) {
      return new Mass(MIN_STAR_MASS);
    }

    return mass;
  }
}
