import type { PureGrammar } from '../firstFollowSets/firstSets.js';
import { lineToString } from '../firstFollowSets/firstSets.js';
import type { IR, RA, WritableArray } from '../utils/types.js';
import { split } from '../utils/utils.js';

export type ParseTable = IR<IR<number | undefined>>;

export function buildParseTable(
  grammar: PureGrammar,
  firstSets: IR<ReadonlySet<string>>,
  followSets: IR<ReadonlySet<string>>
): ParseTable {
  const { terminals, nonTerminals } = splitGrammar(grammar);

  const table = Object.fromEntries(
    nonTerminals.map((nonTerminal) => [
      nonTerminal,
      Object.fromEntries(
        [...terminals, ''].map((terminal) => [
          terminal,
          [] as WritableArray<number>,
        ])
      ),
    ])
  );

  Object.entries(grammar).forEach(([nonTerminal, lines]) =>
    lines.forEach((line, lineIndex) =>
      Array.from(firstSets[lineToString(line)], (firstSetItem) =>
        firstSetItem === ''
          ? followSets[nonTerminal].forEach((followSetItem) =>
              table[nonTerminal][followSetItem].push(lineIndex)
            )
          : table[nonTerminal][firstSetItem].push(lineIndex)
      )
    )
  );

  return resolveAmbiguity(table);
}

export function splitGrammar(pureGrammar: PureGrammar): {
  readonly terminals: RA<string>;
  readonly nonTerminals: RA<string>;
} {
  const [terminals, nonTerminals] = split(
    Array.from(
      new Set([
        Object.keys(pureGrammar)[0],
        ...Object.values(pureGrammar).flat(3),
      ])
    ),
    (key) => key in pureGrammar
  );
  return { terminals, nonTerminals };
}

/**
 * Throw if more than one grammar line matched a given table cell
 */
const resolveAmbiguity = <T>(table: IR<IR<RA<T>>>): IR<IR<T | undefined>> =>
  Object.fromEntries(
    Object.entries(table).map(([nonTerminal, row]) => [
      nonTerminal,
      Object.fromEntries(
        Object.entries(row).map(([terminal, lines]) => {
          if (lines.length > 1)
            throw new Error(
              `Grammar is not LL(0). ${nonTerminal} is ambiguous for terminal ` +
                `${terminal} between lines ${lines[0]} and ${lines[1]}.`
            );
          else return [terminal, lines[0]];
        })
      ),
    ])
  );

export const exportsForTests = {
  resolveAmbiguity,
};
