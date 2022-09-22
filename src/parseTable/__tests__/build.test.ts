import { getFirstSets } from '../../firstFollowSets/firstSets.js';
import { getFollowSets } from '../../firstFollowSets/followSets.js';
import type { Grammar } from '../../grammar/types.js';
import { wrapLine } from '../../processGrammar/leftFactor.js';
import { buildParseTable, exportsForTests } from '../build.js';

const { resolveAmbiguity } = exportsForTests;

test('can build a parse table', () => {
  const grammar: Grammar = {
    s: wrapLine([['lpar', 'x', 'rpar']]),
    x: wrapLine([['id', 'comma', 'x'], []]),
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

describe('resolveAmbiguity', () => {
  test('throws on non LL(1) grammar', () =>
    expect(() => resolveAmbiguity({ a: { b: [1, 2] } })).toThrow(
      /Bad grammar/u
    ));
  test('flattens valid table', () =>
    expect(resolveAmbiguity({ a: { b: [1], c: [] } })).toEqual({
      a: {
        b: 1,
        c: undefined,
      },
    }));
});
