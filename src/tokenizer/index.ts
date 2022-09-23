import type { PureGrammar } from '../firstFollowSets/firstSets.js';
import { splitGrammar } from '../parseTable/build.js';
import type { RA } from '../utils/types.js';

export type Token = {
  readonly name: string;
  readonly lexeme: string | undefined;
};

const reToken = /^(?<name>[^:]+)(:(?<lexeme>.+))? \[\d+,\d+\]$/u;

/**
 * Parse a stringifies token stream
 */
export function tokenize(input: string, grammar: PureGrammar): RA<Token> {
  const terminals = new Set(splitGrammar(grammar).terminals);
  return input.trim().split('\n').map(parseToken.bind(undefined, terminals));
}

/**
 * Parse a single token line
 */
function parseToken(
  validTerminals: ReadonlySet<string>,
  line: string,
  index: number
): Token {
  const groups = reToken.exec(line)?.groups;
  if (groups === undefined)
    throw new Error(`Unable to parse the token on line ${index}: ${line}`);
  else if (!validTerminals.has(groups.name))
    throw new Error(`Unknown token "${groups.name}" found on line ${index}`);
  else return { name: groups.name, lexeme: groups.lexeme };
}

export const exportsForTests = {
  parseToken,
};
