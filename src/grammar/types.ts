import type { State } from 'typesafe-reducer';

import type { IR, RA, RR } from '../utils/types.js';

export type AttributeGrammar = {
  readonly grammar: Grammar;
  readonly initialization: string;
  readonly actions: GrammarActions;
};

export type Grammar = IR<RA<GrammarLine>>;

export type GrammarLine = RA<ActionReference | GrammarPart>;

export type ActionReference = State<
  'ActionReference',
  {
    readonly number: number;
  }
>;

export type GrammarPart = State<
  'Part',
  {
    readonly name: string;
  }
>;

export type GrammarActions = RR<number, string>;
