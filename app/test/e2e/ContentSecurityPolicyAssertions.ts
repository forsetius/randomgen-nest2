import type { Response } from 'supertest';

type ContentSecurityPolicyDirectives = ReadonlyMap<string, readonly string[]>;

function parseContentSecurityPolicy(
  headerValue: string,
): ContentSecurityPolicyDirectives {
  const directives = new Map<string, readonly string[]>();

  headerValue
    .split(';')
    .map((directive) => directive.trim())
    .filter((directive) => directive.length > 0)
    .forEach((directive) => {
      const [name, ...sources] = directive.split(/\s+/u);

      if (name !== undefined) {
        directives.set(name, sources);
      }
    });

  return directives;
}

function getDirectiveSources(
  directives: ContentSecurityPolicyDirectives,
  directiveName: string,
): readonly string[] {
  const sources = directives.get(directiveName);

  expect(sources).toBeDefined();

  return sources ?? [];
}

function expectDirectiveToMatchExactly(
  directives: ContentSecurityPolicyDirectives,
  directiveName: string,
  expectedSources: readonly string[],
): void {
  expect([...getDirectiveSources(directives, directiveName)].sort()).toEqual(
    [...expectedSources].sort(),
  );
}

function expectDirectiveToContainSources(
  directives: ContentSecurityPolicyDirectives,
  directiveName: string,
  expectedSources: readonly string[],
): void {
  expect(getDirectiveSources(directives, directiveName)).toEqual(
    expect.arrayContaining([...expectedSources]),
  );
}

function expectDirectiveToExcludeSources(
  directives: ContentSecurityPolicyDirectives,
  directiveName: string,
  forbiddenSources: readonly string[],
): void {
  const sources = getDirectiveSources(directives, directiveName);

  forbiddenSources.forEach((source) => {
    expect(sources).not.toContain(source);
  });
}

export function expectBalancedContentSecurityPolicy(response: Response): void {
  expect(
    response.headers['content-security-policy-report-only'],
  ).toBeUndefined();
  expect(response.headers['content-security-policy']).toEqual(
    expect.any(String),
  );

  const directives = parseContentSecurityPolicy(
    response.headers['content-security-policy']!,
  );

  expectDirectiveToMatchExactly(directives, 'default-src', ["'self'"]);
  expectDirectiveToMatchExactly(directives, 'script-src', [
    "'self'",
    'https://cdn.jsdelivr.net',
    'https://unpkg.com',
  ]);
  expectDirectiveToContainSources(directives, 'style-src', [
    "'self'",
    "'unsafe-inline'",
    'https:',
    'https://cdn.jsdelivr.net',
    'https://fonts.googleapis.com',
  ]);
  expectDirectiveToContainSources(directives, 'font-src', [
    "'self'",
    'https:',
    'data:',
    'https://cdn.jsdelivr.net',
    'https://fonts.gstatic.com',
  ]);
  expectDirectiveToMatchExactly(directives, 'img-src', ["'self'", 'data:']);
  expectDirectiveToMatchExactly(directives, 'connect-src', [
    "'self'",
    'https://cdn.jsdelivr.net',
  ]);
  expectDirectiveToMatchExactly(directives, 'frame-src', ["'self'"]);
  expectDirectiveToMatchExactly(directives, 'object-src', ["'none'"]);
  expectDirectiveToMatchExactly(directives, 'base-uri', ["'self'"]);
  expectDirectiveToMatchExactly(directives, 'frame-ancestors', ["'self'"]);
  expectDirectiveToMatchExactly(directives, 'form-action', ["'self'"]);
  expectDirectiveToMatchExactly(directives, 'script-src-attr', ["'none'"]);

  for (const directiveName of directives.keys()) {
    expectDirectiveToExcludeSources(directives, directiveName, ['*', 'http:']);
  }

  expectDirectiveToExcludeSources(directives, 'script-src', [
    "'unsafe-inline'",
    "'unsafe-eval'",
    'data:',
    'blob:',
    'https:',
  ]);
  expectDirectiveToExcludeSources(directives, 'connect-src', [
    "'unsafe-inline'",
    "'unsafe-eval'",
    'data:',
    'blob:',
    'https:',
  ]);
}
