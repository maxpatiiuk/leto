import type { TokenWithMatch } from '../spec/types.js';
import type { RA } from '../utils/types.js';

export type Token = {
  readonly simplePosition: number;
  readonly spec: TokenWithMatch;
};

export type Position = {
  readonly lineNumber: number;
  readonly columnNumber: number;
};

export type MatcherResult = {
  readonly token: TokenWithMatch | undefined;
  readonly tokenLength: number;
  readonly errors: RA<SyntaxError>;
};

export type SyntaxError = {
  readonly start: number;
  readonly end: number;
  readonly message: string;
};
