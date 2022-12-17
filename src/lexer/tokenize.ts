import type { ErrorSpec, Spec } from '../spec/types.js';
import type { RA } from '../utils/types.js';
import { filterArray } from '../utils/types.js';
import type { MatcherResult, SyntaxError, Token } from './types.js';

export function tokenize(
  specs: RA<Spec>,
  input: string,
  positionOffset: number
): {
  readonly tokens: RA<Token>;
  readonly errors: RA<SyntaxError>;
} {
  const matchingSpecs = filterArray(
    specs.map((spec) => {
      const match = spec.regex.exec(input)?.[0];
      return match === undefined ? undefined : { ...spec, match };
    })
  );

  const longestSpec = Math.max(
    ...matchingSpecs.map(({ match }) => match.length)
  );
  const spec =
    matchingSpecs.find(({ match }) => match.length === longestSpec) ??
    invalidToken(input);

  const { token, tokenLength, errors } = specToToken(spec);

  const remainingInput = input.slice(tokenLength);
  const { tokens, errors: additionalErrors } =
    remainingInput.length === 0
      ? {
          tokens: [],
          errors: [],
        }
      : tokenize(specs, remainingInput, positionOffset + tokenLength);

  return {
    tokens: [
      ...(typeof token === 'object'
        ? [
            {
              spec: token,
              simplePosition: positionOffset,
            },
          ]
        : []),
      ...tokens,
    ],
    errors: [...repositionErrors(errors, positionOffset), ...additionalErrors],
  };
}

export const specToToken = (
  spec: Spec & { readonly match: string }
): MatcherResult => ({
  token: spec.type === 'TokenSpec' ? spec : undefined,
  tokenLength: spec.match.length,
  errors:
    spec.type === 'ErrorSpec'
      ? [
          {
            start: 0,
            end: spec.match.length,
            message: spec.message,
          },
        ]
      : [],
});

export const invalidToken = (
  input: string
): ErrorSpec & { readonly match: string } => ({
  type: 'ErrorSpec',
  regex: /./u,
  message: `Illegal character ${input[0]}`,
  match: input[0],
});

/**
 * Offset the positions in the error messages to match current position
 */
export const repositionErrors = (
  errors: RA<SyntaxError>,
  positionOffset: number
): RA<SyntaxError> =>
  errors.map(({ start, end, ...error }) => ({
    ...error,
    start: start + positionOffset,
    end: end + positionOffset,
  }));
