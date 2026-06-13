import fs from 'node:fs';
import path from 'node:path';
import { APP_ROOT } from '../../../../src/appConstants';

describe('StarSystem migration contract', () => {
  it('removes the obsolete topology and factory files', () => {
    for (const relativePath of [
      'src/domain/starsystem/data/starLayouts.ts',
      'src/domain/starsystem/domain/System.ts',
      'src/domain/starsystem/generator/SystemFactory.ts',
      'src/domain/starsystem/generator/starSystemFactories/index.ts',
    ]) {
      expect(fs.existsSync(path.join(APP_ROOT, relativePath))).toBe(false);
    }
  });

  it('keeps the generator free from the legacy system pipeline', () => {
    const generatorSource = fs.readFileSync(
      path.join(
        APP_ROOT,
        'src/domain/starsystem/generator/StarSystemGenerator.ts',
      ),
      'utf-8',
    );

    expect(generatorSource).not.toContain('starLayouts');
    expect(generatorSource).not.toContain('createSystem(');
    expect(generatorSource).toContain('StarHierarchyGenerator');
  });
});
