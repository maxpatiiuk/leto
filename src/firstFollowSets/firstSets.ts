import type { Grammar } from '../grammar/types.js';
import { wrapPart } from '../processGrammar/leftFactor.js';
import type { IR, RA } from '../utils/types.js';
import { filterArray } from '../utils/types.js';

/**
 * Computer first sets for all non-terminals and sequences of terminals
 */
export function getFirstSets(grammar: Grammar): IR<ReadonlySet<string>> {
  const withoutActions = toPureGrammar(grammar);
  const allKeys = Array.from(
    new Set(
      [
        [],
        ...Object.keys(grammar).map((item) => [wrapPart(item)]),
        ...Object.values(withoutActions).flat().flatMap(findAllSubsets),
      ].map(lineToString)
    )
  );

  return saturate(
    saturateFirstSets.bind(undefined, withoutActions),
    Object.fromEntries(allKeys.map((key) => [key, new Set()]))
  );
}

export const findAllSubsets = <T>(array: RA<T>): RA<RA<T>> =>
  array.flatMap((_, index) =>
    array
      .slice(index)
      .map((_, length) => array.slice(index, index + length + 1))
  );

export type PureGrammar = IR<RA<RA<string>>>;
/**
 * Remove actions from the grammar. Leave only terminals and non-terminals
 */
export const toPureGrammar = (grammar: Grammar): PureGrammar =>
  Object.fromEntries(
    Object.entries(grammar).map(([name, lines]) => [
      name,
      lines.map((line) =>
        filterArray(
          line.map((part) => (part.type === 'Part' ? part.name : undefined))
        )
      ),
    ])
  );

export const lineToString = (line: RA<string>): string =>
  JSON.stringify(filterArray(line));

/**
 * Call a hash-set producing function until the result does not change
 */
export function saturate(
  callback: (sets: IR<ReadonlySet<string>>) => IR<ReadonlySet<string>>,
  initialSets: IR<ReadonlySet<string>>
): IR<ReadonlySet<string>> {
  const initialLength = getSetsLength(initialSets);
  const newSets = callback(initialSets);
  return getSetsLength(newSets) === initialLength
    ? newSets
    : saturate(callback, newSets);
}

/**
 * Calculate the total length of all sets
 * Used to determine if the first sets have stabilized
 */
const getSetsLength = (firstSets: IR<ReadonlySet<string>>): number =>
  Object.values(firstSets).reduce((sum, { size }) => sum + size, 0);

/**
 * Recursive algorithm for computing first sets.
 * Stops when no more changes are made to the first sets
 */
const saturateFirstSets = (
  grammar: PureGrammar,
  firstSets: IR<ReadonlySet<string>>
): IR<ReadonlySet<string>> =>
  Object.fromEntries(
    Object.keys(firstSets).map((key) => {
      const parts = JSON.parse(key) as RA<string>;
      if (parts.length === 0) return [key, new Set([''])];

      const firstSet = new Set<string>();
      const hasEpsilon = parts.every((part) => {
        const newFirstSet = buildSet(grammar, firstSets, part);
        Array.from(newFirstSet, (part) =>
          part === '' ? undefined : firstSet.add(part)
        );
        return newFirstSet.has('');
      });

      if (hasEpsilon) firstSet.add('');
      return [key, firstSet];
    })
  );

/**
 * Build a first set for a single terminal or non-terminal
 */
function buildSet(
  grammar: PureGrammar,
  firstSets: IR<ReadonlySet<string>>,
  part: string
): ReadonlySet<string> {
  const isTerminal = !(part in grammar);
  return new Set(
    isTerminal
      ? [part]
      : grammar[part]
          .map(lineToString)
          .flatMap((line) => Array.from(firstSets[line]))
  );
}

export const exportsForTests = {
  lineToString,
  saturateFirstSets,
  buildSet,
  saturate,
  getSetsLength,
};
