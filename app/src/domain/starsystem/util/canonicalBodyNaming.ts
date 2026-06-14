export function normalizeHierarchyPath(path: string): string {
  return path.replaceAll('.', '-');
}

export function formatHierarchyBarycenterName(path: string): string {
  if (path === 'root') {
    return 'Root';
  }

  return path
    .split('.')
    .map((segment) => {
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    })
    .join(' ');
}

export function formatAlphabeticOrdinal(ordinal: number): string {
  let remaining = ordinal;
  let result = '';

  while (remaining > 0) {
    const zeroBasedOrdinal = (remaining - 1) % 26;
    result = String.fromCharCode(65 + zeroBasedOrdinal) + result;
    remaining = Math.floor((remaining - 1) / 26);
  }

  return result;
}
