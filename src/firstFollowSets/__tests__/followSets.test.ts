import { wrapLine, wrapPart } from '../../processGrammar/leftFactor.js';
import { theories } from '../../tests/utils.js';
import {
  exportsForTests,
  findAllIndexesOf,
  getFollowSets,
} from '../followSets.js';

const { findTerminalEndings } = exportsForTests;

describe('a', () => {
  theories(getFollowSets, [
    {
      in: [
        {
          s: wrapLine([['a'], ['b', 'r']]),
          q: [],
          r: wrapLine([
            ['q', 'c'],
            ['q', 's'],
            ['q', 'q'],
          ]),
        },
        {
          '["s"]': new Set<string>(['a', 'b']),
          '["q"]': new Set<string>(['']),
          '["r"]': new Set<string>(['c', 'a', 'b', '']),
          '["a"]': new Set(['a']),
          '["b"]': new Set(['b']),
          '["c"]': new Set(['c']),
          '["b","r"]': new Set(['b']),
          '["q","c"]': new Set<string>(['c']),
          '["q","s"]': new Set<string>(['a', 'b']),
          '["q","q"]': new Set<string>(['']),
          '[]': new Set(['']),
        },
      ],
      out: {
        s: new Set(['']),
        q: new Set(['c', 'a', 'b', '']),
        r: new Set(['']),
      },
    },
  ]);
});

theories(findTerminalEndings, [
  {
    in: [
      {
        a: wrapLine([['b', 'a', 'c', 'a', 'd']]),
        b: wrapLine([['a'], []]),
      },
      'a',
    ],
    out: [
      { terminalName: 'a', ending: wrapLine([['c', 'a', 'd']])[0] },
      { terminalName: 'a', ending: [wrapPart('d')] },
      { terminalName: 'b', ending: [] },
    ],
  },
]);

theories(findAllIndexesOf, [
  { in: [[], 'a'], out: [] },
  { in: [['a'], 'a'], out: [0] },
  { in: [['b'], 'a'], out: [] },
  { in: [[1, 0, 2, 0, 3, 0], 0], out: [1, 3, 5] },
]);
