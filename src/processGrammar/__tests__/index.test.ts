import { theories } from '../../tests/utils.js';
import { postProcessGrammar, removeLeftRecursion } from '../index.js';
import { wrapLine } from '../leftFactor.js';

theories(postProcessGrammar, {
  'calls removeLeftRecursion': {
    in: [
      {
        grammar: {
          a: wrapLine([['a', 'b']]),
        },
        initialization: '',
        actions: {},
      },
    ],
    out: {
      grammar: {
        a: wrapLine([["a'"]]),
        "a'": wrapLine([['b', "a'"], []]),
      },
      initialization: '',
      actions: {},
    },
  },
  'calls leftFactor': {
    in: [
      {
        grammar: {
          a: wrapLine([['b', 'c'], ['b']]),
        },
        initialization: '',
        actions: {},
      },
    ],
    out: {
      grammar: {
        a: wrapLine([['b', 'a__b']]),
        a__b: wrapLine([['c'], []]),
      },
      initialization: '',
      actions: {},
    },
  },
});

theories(removeLeftRecursion, [
  { in: [{}], out: {} },
  {
    in: [{ a: wrapLine([['a', 'b']]) }],
    out: {
      a: wrapLine([["a'"]]),
      "a'": wrapLine([['b', "a'"], []]),
    },
  },
  {
    in: [{ a: wrapLine([['c'], ['a', 'b']]) }],
    out: {
      a: wrapLine([['c', "a'"]]),
      "a'": wrapLine([['b', "a'"], []]),
    },
  },
]);
