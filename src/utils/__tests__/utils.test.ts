import { theories } from '../../tests/utils.js';
import { escapeRegExp, group, mappedFind, split } from '../utils.js';

describe('mappedFind', () => {
  test('Found value', () => {
    expect(
      mappedFind([undefined, 1, 2, 3, 4, 5], (value) =>
        typeof value === 'number' ? value * 2 : undefined
      )
    ).toBe(2);
  });
  test('Not found a value', () => {
    expect(
      mappedFind([undefined, undefined, undefined], (id) => id)
    ).toBeUndefined();
  });
});

theories(split, [
  {
    in: [[1, 2, 3, 4, 5, 6, 7, 8], (value: number) => value % 2 === 0],
    out: [
      [1, 3, 5, 7],
      [2, 4, 6, 8],
    ],
  },
]);

theories(group, [
  {
    in: [
      [
        ['a', 1],
        ['a', 2],
        ['b', 3],
        ['c', 4],
        ['a', 5],
      ],
    ],
    out: [
      ['a', [1, 2, 5]],
      ['b', [3]],
      ['c', [4]],
    ],
  },
]);

theories(escapeRegExp, [
  {
    in: ['/^[a]{1,4}.a?b+$/'],
    out: '/\\^\\[a\\]\\{1,4\\}\\.a\\?b\\+\\$/',
  },
]);
