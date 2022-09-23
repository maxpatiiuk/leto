import { parse } from '../index.js';
import {
  getFirstSets,
  toPureGrammar,
} from '../../firstFollowSets/firstSets.js';
import { getFollowSets } from '../../firstFollowSets/followSets.js';
import { buildParseTable } from '../../parseTable/build.js';
import { Grammar } from '../../grammar/types.js';
import { wrapPart } from '../../processGrammar/leftFactor.js';
import { Token } from '../../tokenizer/index.js';
import { RA } from '../../utils/types.js';

test('parse', () => {
  const grammar: Grammar = {
    Expr: [
      [{ type: 'ActionReference', number: 1 }],
      [
        wrapPart('('),
        wrapPart('Expr'),
        wrapPart(')'),
        { type: 'ActionReference', number: 2 },
      ],
      [
        wrapPart('['),
        wrapPart('Expr'),
        wrapPart(']'),
        { type: 'ActionReference', number: 3 },
      ],
    ],
  };
  const pureGrammar = toPureGrammar(grammar);
  const firstSets = getFirstSets(pureGrammar);
  const followSets = getFollowSets(pureGrammar, firstSets);
  const parseTable = buildParseTable(pureGrammar, firstSets, followSets);
  const tokenStream: RA<Token> = [
    { name: '[', lexeme: '[[' },
    { name: '(', lexeme: '(' },
    { name: ')', lexeme: ')' },
    { name: ']', lexeme: ']]' },
  ];
  expect(parse(grammar, parseTable, tokenStream)).toEqual([
    { number: 1, lexeme: ')' },
    { number: 2, lexeme: ']]' },
    { number: 3, lexeme: undefined },
  ]);
});
