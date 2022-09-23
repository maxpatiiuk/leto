import { exportsForTests, tokenize } from '../index.js';
import { theories } from '../../tests/utils.js';
import { wrapLine } from '../../processGrammar/leftFactor.js';

const { getTokens, parseToken } = exportsForTests;

theories(tokenize, [
  {
    in: [
      `a [1,3]\nb:c  d [3,17]\n`,
      { a1: wrapLine([['a']]), b1: wrapLine([['b']]) },
    ],
    out: [
      { name: 'a', lexime: undefined },
      { name: 'b', lexime: 'c  d' },
    ],
  },
]);

theories(getTokens, [
  {
    in: [
      {
        a: wrapLine([['b', 'c']]),
        b: wrapLine([['d']]),
      },
    ],
    out: ['c', 'd'],
  },
]);

describe('parseToken', () => {
  test('throws on invalid line', () =>
    expect(parseToken(new Set(), 'a [1.0, 3]', 0)).toThrow(
      /Unable to parse the token/u
    ));
  test('throws on unknown token', () =>
    expect(parseToken(new Set(['a']), 'b [1,3]', 0)).toThrow(/Unknown token/u));
  test('parses token without lexime', () =>
    expect(parseToken(new Set(['a']), 'a [3,5]', 0)).toEqual({
      name: 'a',
      lexime: undefined,
    }));
  test('parses token with lexime', () =>
    expect(parseToken(new Set(['a']), 'a: b [1,3] ', 0)).toEqual({
      name: 'a',
      lexime: ' b ',
    }));
});
