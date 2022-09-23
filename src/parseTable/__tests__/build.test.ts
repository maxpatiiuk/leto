import { getFirstSets, PureGrammar } from '../../firstFollowSets/firstSets.js';
import { getFollowSets } from '../../firstFollowSets/followSets.js';
import { theories } from '../../tests/utils.js';
import { buildParseTable, exportsForTests, splitGrammar } from '../build.js';

const { resolveAmbiguity } = exportsForTests;

test('can build a parse table', () => {
  const grammar: PureGrammar = {
    s: [['lpar', 'x', 'rpar']],
    x: [['id', 'comma', 'x'], []],
  };
  const firstSets = getFirstSets(grammar);
  expect(
    buildParseTable(grammar, firstSets, getFollowSets(grammar, firstSets))
  ).toEqual({
    s: {
      lpar: 0,
      rpar: undefined,
      id: undefined,
      comma: undefined,
    },
    x: {
      lpar: undefined,
      rpar: 1,
      id: 0,
      comma: undefined,
    },
  });
});

theories(splitGrammar, [
  {
    in: [{}],
    out: { terminals: [], nonTerminals: [] },
  },
  {
    in: [{ a: [['a', 'b']], b: [['c']] }],
    out: { terminals: ['c'], nonTerminals: ['a', 'b'] },
  },
]);

describe('resolveAmbiguity', () => {
  test('throws on non LL(1) grammar', () =>
    expect(() => resolveAmbiguity({ a: { b: [1, 2] } })).toThrow(
      /Grammar is not LL\(0\)/u
    ));
  test('flattens valid table', () =>
    expect(resolveAmbiguity({ a: { b: [1], c: [] } })).toEqual({
      a: {
        b: 1,
        c: undefined,
      },
    }));
});
