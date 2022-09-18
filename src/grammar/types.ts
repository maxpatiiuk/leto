import type { State } from 'typesafe-reducer';

export type TokenSpec = State<
  'TokenSpec',
  {
    readonly regex: RegExp;
    readonly name: string;
    readonly keepLiteral: boolean;
  }
>;

export type TokenWithMatch = TokenSpec & { readonly match: string };

export type SkipSpec = State<
  'SkipSpec',
  {
    readonly regex: RegExp;
  }
>;

export type ErrorSpec = State<
  'ErrorSpec',
  {
    readonly regex: RegExp;
    readonly message: string;
  }
>;

export type Spec = ErrorSpec | SkipSpec | TokenSpec;
