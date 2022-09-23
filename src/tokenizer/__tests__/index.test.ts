import { theories } from '../../tests/utils.js';
import { exportsForTests, tokenize } from '../index.js';

const { parseToken } = exportsForTests;

theories(tokenize, [
  {
    in: [`a [1,3]\nb:c  d [3,17]\n`, { a1: [['a']], b1: [['b']] }],
    out: [
      { name: 'a', lexeme: undefined },
      { name: 'b', lexeme: 'c  d' },
    ],
  },
]);

describe('parseToken', () => {
  test('throws on invalid line', () =>
    expect(() => parseToken(new Set(), 'a [1.0, 3]', 0)).toThrow(
      /Unable to parse the token/u
    ));
  test('throws on unknown token', () =>
    expect(() => parseToken(new Set(['a']), 'b [1,3]', 0)).toThrow(
      /Unknown token/u
    ));
  test('parses token without lexeme', () =>
    expect(parseToken(new Set(['a']), 'a [3,5]', 0)).toEqual({
      name: 'a',
      lexeme: undefined,
    }));
  test('parses token with lexeme', () =>
    expect(parseToken(new Set(['a']), 'a: b  [1,3]', 0)).toEqual({
      name: 'a',
      lexeme: ' b ',
    }));
});
