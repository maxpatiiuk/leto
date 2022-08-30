import { formatErrors } from './formatErrors.js';
import { formatTokens } from './formatTokens.js';
import { tokenize } from './lexer/index.js';
import { cretePositionResolver } from './utils/resolvePosition.js';
import { RA } from './utils/types.js';
import { Spec } from './spec/types.js';

export function parse(
  specs: RA<Spec>,
  rawText: string
): {
  readonly formattedErrors: string;
  readonly output: string;
} {
  const { tokens, errors } = tokenize(specs, rawText, 0);

  const positionResolver = cretePositionResolver(rawText);
  return {
    formattedErrors: formatErrors(errors, positionResolver),
    output: formatTokens(tokens, positionResolver),
  };
}
