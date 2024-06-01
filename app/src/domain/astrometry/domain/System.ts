import { Star } from './Star';
import { rollDice } from '@shared/util/Roller';
import { RollableCollection } from '@shared/util/RollableCollection';
import { SpectralClass } from '../types/SpectralClass';
import * as spectralClasses from '@dict/astrometry/spectralClasses.json';

export class System {
  private static spectralClasses: RollableCollection<SpectralClass>;
  static {
    this.spectralClasses = new RollableCollection(spectralClasses);
  }

  private age?: number;
  private primaryStar?: Star;
  private companionStars: Star[] = [];
  private orbitals: Orbital[] = [];

  public createPrimaryStar(): void {
    const spectralClass = System.spectralClasses.getRandom();
    this.age = rollDice(spectralClass.age);
    const finalClass = this.ageStar(spectralClass, age);
  }

  public createCompanionStar(nth: number): void {
    const spectralClass = System.spectralClasses.getRandom(
      nth * rollDice('2d10'),
    );
  }

  private rollSystemAge(spectralClass: SpectralClass): number {}
}
