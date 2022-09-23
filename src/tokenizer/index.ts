import { toPureGrammar } from '../firstFollowSets/firstSets.js';
import type { Grammar } from '../grammar/types.js';
import type { RA } from '../utils/types.js';

export type Token = {
  readonly name: string;
  readonly lexime: string | undefined;
};

const reToken = /^(?<name>[^:]+)(:(?<lexime>.+))? \[\d+,\d+\]$/u;

/**
 * Parse a stringifies token stream
 */
export function tokenize(input: string, grammar: Grammar) {
  const tokens = new Set(getTokens(grammar));
  return input.trim().split('\n').map(parseToken.bind(undefined, tokens));
}

/**
 * Get a list of all defined tokens
 */
const getTokens = (grammar: Grammar): RA<string> =>
  Object.values(toPureGrammar(grammar))
    .flat(2)
    .map(({ name }) => name)
    .filter((name) => !(name in grammar));

/**
 * Parse a single token line
 */
function parseToken(
  validTokens: ReadonlySet<string>,
  line: string,
  index: number
): Token {
  const groups = reToken.exec(line)?.groups;
  if (groups === undefined)
    throw new Error(`Unable to parse the token on line ${index}: ${line}`);
  else if (!validTokens.has(groups.name))
    throw new Error(`Unknown token "${groups.name}" found on line ${index}`);
  else return { name: groups.name, lexime: groups.lexime };
}

export const exportsForTests = {
  getTokens,
  parseToken,
};
