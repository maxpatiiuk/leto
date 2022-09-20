import { theories } from '../../tests/utils.js';
import {
  deduplicateRule,
  leftFactor,
  optimizeLines,
  wrapLine,
} from '../leftFactor.js';

theories(leftFactor, [
  {
    in: [
      {
        a: wrapLine([['a', 'b'], ['a', 'c'], ['b']]),
        b: wrapLine([['a']]),
        c: wrapLine([['a']]),
      },
    ],
    out: {
      a: wrapLine([['b'], ['a', 'a__a']]),
      a__a: wrapLine([['b'], ['c']]),
      b: wrapLine([['a']]),
      c: wrapLine([['a']]),
    },
  },
]);

theories(optimizeLines, [
  {
    in: [['a', wrapLine([['a', 'b'], ['a', 'c'], ['b']])]],
    out: [
      ['a', wrapLine([['b'], ['a', 'a__a']])],
      ['a__a', wrapLine([['b'], ['c']])],
    ],
  },
]);

theories(deduplicateRule, [
  {
    in: [
      'a',
      [
        ['a', wrapLine([['a', 'b'], ['a', 'c'], ['b']])],
        ['b', wrapLine([['a']])],
      ],
    ],
    out: [
      ['a', wrapLine([['b'], ['a', 'a__a']])],
      ['a__a', wrapLine([['b'], ['c']])],
      ['b', wrapLine([['a']])],
    ],
  },
]);
