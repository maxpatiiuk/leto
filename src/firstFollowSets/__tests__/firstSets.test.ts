import { wrapLine } from '../../processGrammar/leftFactor.js';
import { theories } from '../../tests/utils.js';
import {
  exportsForTests,
  findAllSubsets,
  getFirstSets,
  toPureGrammar,
  lineToString,
} from '../firstSets.js';

const { saturate, getSetsLength, buildSet } = exportsForTests;

describe('a', () => {
  theories(getFirstSets, [
    {
      in: [
        {
          s: wrapLine([['a'], ['b', 'r']]),
          q: [[{ type: 'ActionReference', number: 4 }]],
          r: wrapLine([
            ['q', 'c'],
            ['q', 's'],
            ['q', 'q'],
          ]),
        },
      ],
      out: {
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
    },
    {
      name: 'non-terminal with epsilon results in next first set being appended',
      in: [{ a: wrapLine([['b', 'c']]), b: wrapLine([['d'], []]) }],
      out: {
        '["a"]': new Set(['d', 'c']),
        '["b","c"]': new Set(['d', 'c']),
        '["b"]': new Set(['d', '']),
        '["d"]': new Set(['d']),
        '[]': new Set(['']),
      },
    },
    {
      name: 'if all parts have epsilons, result has epsilon too',
      in: [
        {
          a: wrapLine([['b', 'c']]),
          b: wrapLine([['d'], []]),
          c: wrapLine([['e'], []]),
        },
      ],
      out: {
        '["a"]': new Set(['d', 'e', '']),
        '["b","c"]': new Set(['d', 'e', '']),
        '["c"]': new Set(['e', '']),
        '["b"]': new Set(['d', '']),
        '["d"]': new Set(['d']),
        '["e"]': new Set(['e']),
        '[]': new Set(['']),
      },
    },
  ]);
});

theories(findAllSubsets, [
  {
    in: [[]],
    out: [],
  },
  {
    in: [[1, 2, 3]],
    out: [[1], [1, 2], [1, 2, 3], [2], [2, 3], [3]],
  },
]);

theories(toPureGrammar, [
  {
    in: [
      {
        a: [[{ type: 'ActionReference', number: 2 }]],
        b: wrapLine([['b']]),
      },
    ],
    out: {
      a: [[]],
      b: wrapLine([['b']]),
    },
  },
]);

theories(lineToString, [
  {
    in: [[]],
    out: '[]',
  },
  {
    in: [wrapLine([['a', 'b']])[0]],
    out: '["a","b"]',
  },
  {
    name: 'action References are ignored',
    in: [[{ type: 'ActionReference', number: 1 }]],
    out: '[]',
  },
]);

theories(saturate, [
  {
    in: [
      (sets) =>
        sets.a.size < 5
          ? { a: new Set([...Array.from(sets.a), sets.a.size.toString()]) }
          : { ...sets },
      { a: new Set([]) },
    ],
    out: { a: new Set(['0', '1', '2', '3', '4']) },
  },
]);

theories(getSetsLength, [
  {
    in: [{}],
    out: 0,
  },
  {
    in: [{ a: new Set(['a', 'b']) }],
    out: 2,
  },
]);

theories(buildSet, [
  {
    in: [{ a: wrapLine([['b']]) }, {}, 'b'],
    out: new Set(['b']),
  },
  {
    in: [
      { a: wrapLine([['b'], ['c', 'd']]) },
      {
        '["b"]': new Set(['b']),
        '["c","d"]': new Set(['d', 'e']),
      },
      'a',
    ],
    out: new Set(['b', 'd', 'e']),
  },
  {
    in: [{ a: [[]] }, { '[]': new Set([]) }, 'a'],
    out: new Set([]),
  },
]);
