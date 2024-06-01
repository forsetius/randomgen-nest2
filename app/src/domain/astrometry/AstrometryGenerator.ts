import { RollableCollection } from '@shared/util/RollableCollection';
import { StarCount } from './types/StarCount';
import { SpectralClass } from './types/SpectralClass';
import { LuminosityClass } from './types/LuminosityClass';
import * as starCounts from '@dict/astrometry/starCount.json';
import * as spectralClasses from '@dict/astrometry/spectralClasses.json';
import * as luminosityClasses from '@dict/astrometry/luminosityClasses.json';
import { AstrometryGenerateSystemQueryDto } from './dto/AstrometryGenerateSystemQueryDto';
import { rollDice } from '@shared/util/Roller';
import { Star } from './domain/Star';

export class AstrometryGenerator {
  private starCounts: RollableCollection<StarCount>;
  private spectralClasses: RollableCollection<SpectralClass>;
  private luminosityClasses: LuminosityClass[];

  public constructor() {
    this.starCounts = new RollableCollection(starCounts);
    this.spectralClasses = new RollableCollection(spectralClasses);
    this.luminosityClasses = luminosityClasses;
  }

  public generateSystem(query: AstrometryGenerateSystemQueryDto) {
    const starCount = this.starCounts.getRandom().count;
    const stars = new Array(starCount).fill(undefined);
    for (let i = 0; i < starCount; i++) {
      const spectralClass = this.spectralClasses.getRandom(
        i * rollDice('2d10'),
      );
      stars[i] = new Star(spectralClass);
    }
  }
}
