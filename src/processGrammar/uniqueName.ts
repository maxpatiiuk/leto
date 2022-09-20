import type { RA } from '../utils/types.js';
import { escapeRegExp } from '../utils/utils.js';

const uniqueCharacter = "'";

export function getUniqueName(name: string, usedNames: RA<string>): string {
  if (!usedNames.includes(name)) return name;
  const indexRegex = new RegExp(
    `^${escapeRegExp(name)}(?<ticks>${uniqueCharacter}*)$`,
    'u'
  );
  const longestMatch = Math.max(
    -1,
    ...usedNames.map((name) => indexRegex.exec(name)?.groups?.ticks.length ?? 0)
  );
  return longestMatch === -1
    ? `${name}`
    : `${name}${uniqueCharacter.repeat(longestMatch + 1)}`;
}
