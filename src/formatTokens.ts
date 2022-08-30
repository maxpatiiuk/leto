import { formatPosition } from './formatErrors.js';
import type { Position, Token } from './lexer/types.js';
import type { TokenWithMatch } from './spec/types.js';
import type { RA } from './utils/types.js';

export const formatTokens = (
  tokens: RA<Token>,
  positionResolver: (simplePosition: number) => Position
): string =>
  tokens
    .map(
      ({ spec, simplePosition }) =>
        `${formatName(spec)} ${formatPosition(
          positionResolver(simplePosition)
        )}`
    )
    .join('\n');

export function formatName({
  keepLiteral,
  name,
  match,
}: TokenWithMatch): string {
  const payload = keepLiteral ? `:${match}` : '';
  return `${name}${payload}`;
}
