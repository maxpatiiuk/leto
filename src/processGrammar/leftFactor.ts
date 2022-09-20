import type { Grammar, GrammarLine, GrammarPart } from '../grammar/types.js';
import type { RA } from '../utils/types.js';
import { filterArray } from '../utils/types.js';
import { split } from '../utils/utils.js';

export const wrapLine = (lines: RA<RA<string>>): RA<RA<GrammarPart>> =>
  lines.map((line) => line.map(wrapPart));
export const wrapPart = (name: string): GrammarPart => ({ type: 'Part', name });

/**
 * Make grammar left-factored by factoring out common parts of rules
 *
 * This is a pre-requisite for the LL(1) parser
 *
 * Turn something like:
 * ```
 * A ::= B C | B D
 * ```
 *
 * into:
 *
 * ```
 * A ::= B A__B
 * A__B ::= C | D
 * ```
 *
 * This way, if `B C` fails, we don't have to recheck `B` again for checking
 * the match against `B D`
 *
 */

export const leftFactor = (grammar: Grammar): Grammar =>
  Object.fromEntries(Object.entries(grammar).flatMap(optimizeLines));

export function optimizeLines([name, lines]: readonly [
  string,
  RA<GrammarLine>
]): RA<readonly [string, RA<GrammarLine>]> {
  const rules = filterArray(
    lines.map((line) => {
      const firstPart = line.at(0);
      return firstPart?.type === 'Part' ? firstPart.name : undefined;
    })
  );
  const duplicateRules = rules.filter(
    (rule, index) => rules.indexOf(rule) !== index
  );
  return duplicateRules.reduce<RA<readonly [string, RA<GrammarLine>]>>(
    (lines, duplicateRule) => deduplicateRule(duplicateRule, lines),
    [[name, lines]]
  );
}

export const ruleJoinSymbol = '__' as const;

export function deduplicateRule(
  deduplicateRule: string,
  [[name, originalLines], ...rest]: RA<readonly [string, RA<GrammarLine>]>
): RA<readonly [string, RA<GrammarLine>]> {
  const newName = `${name}${ruleJoinSymbol}${deduplicateRule}`;
  const [otherLines, duplicateLines] = split(
    originalLines,
    (line) => line[0].type === 'Part' && line[0].name === deduplicateRule
  );
  const newRules = [
    [name, [...otherLines, [wrapPart(deduplicateRule), wrapPart(newName)]]],
    [newName, duplicateLines.map((line) => line.slice(1))],
    ...rest,
  ] as const;
  return newRules.flatMap(([name, lines]) => optimizeLines([name, lines]));
}
