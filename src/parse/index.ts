import { toPureGrammar } from '../firstFollowSets/firstSets.js';
import type {
  ActionReference,
  Grammar,
  GrammarPart,
} from '../grammar/types.js';
import type { ParseTable } from '../parseTable/build.js';
import { splitGrammar } from '../parseTable/build.js';
import { wrapPart } from '../processGrammar/leftFactor.js';
import type { Token } from '../tokenizer/index.js';
import type { RA, WritableArray } from '../utils/types.js';

export type Steps = {
  readonly number: number;
  readonly lexeme: string | undefined;
};

export function parse(
  grammar: Grammar,
  parseTable: ParseTable,
  tokens: RA<Token>
): RA<Steps> {
  const { terminals } = splitGrammar(toPureGrammar(grammar));
  const terminalsSet = new Set(terminals);

  const predictionStack: WritableArray<ActionReference | GrammarPart> = [
    wrapPart(Object.keys(grammar)[0]),
  ];

  const actions: WritableArray<Steps> = [];
  let tokenIndex = 0;

  while (predictionStack.length > 0) {
    const stackTop = predictionStack.pop()!;
    const lookaheadToken = tokens.at(tokenIndex);
    if (stackTop.type === 'ActionReference')
      actions.push({ number: stackTop.number, lexeme: lookaheadToken?.lexeme });
    else {
      const lookahead = lookaheadToken?.name ?? '';
      if (terminalsSet.has(stackTop.name)) {
        if (lookaheadToken === undefined)
          throw new Error(`Unexpected end of file. Expected: ${stackTop.name}`);
        if (stackTop.name !== lookahead)
          throw new Error(
            `Unexpected terminal at ${tokenIndex + 1}/${tokens.length}`
          );
        tokenIndex += 1;
      } else {
        const lineIndex = parseTable[stackTop.name][lookahead];
        if (lineIndex === undefined)
          throw new Error(
            `Unexpected terminal ${lookahead} at ${tokenIndex + 1}/${
              tokens.length
            }`
          );
        const line = grammar[stackTop.name][lineIndex];
        predictionStack.push(...Array.from(line).reverse());
      }
    }
  }

  if (tokenIndex !== tokens.length)
    throw new Error(
      `Prediction stack is empty, but tokens stack is not. Stopped on token ${
        tokenIndex + 1
      }/${tokens.length}`
    );

  return actions;
}
