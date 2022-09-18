import type { Spec } from '../../grammar/types.js';
import { theories } from '../../tests/utils.js';
import type { RA } from '../../utils/types.js';
import {
  invalidToken,
  repositionErrors,
  specToToken,
  tokenize,
} from '../index.js';

const specs: RA<Spec> = [
  {
    type: 'ErrorSpec',
    regex: /^B/u,
    message: 'Some Error',
  },
  {
    type: 'SkipSpec',
    regex: /^\s+/u,
  },
  {
    type: 'TokenSpec',
    regex: /^A/u,
    keepLiteral: true,
    name: 'TOKEN',
  },
];

theories(tokenize, [
  [
    [specs, 'A B', 0],
    {
      errors: [
        {
          end: 3,
          message: 'Some Error',
          start: 2,
        },
      ],
      tokens: [
        {
          simplePosition: 0,
          spec: {
            keepLiteral: true,
            match: 'A',
            name: 'TOKEN',
            regex: /^A/u,
            type: 'TokenSpec',
          },
        },
      ],
    },
  ],
]);

theories(specToToken, [
  [
    [
      {
        type: 'ErrorSpec',
        regex: /./u,
        message: 'Some Error',
        match: 'test',
      },
    ],
    {
      token: undefined,
      tokenLength: 4,
      errors: [
        {
          start: 0,
          end: 4,
          message: 'Some Error',
        },
      ],
    },
  ],
  [
    [
      {
        type: 'SkipSpec',
        regex: /./u,
        match: 'test',
      },
    ],
    {
      token: undefined,
      tokenLength: 4,
      errors: [],
    },
  ],
  [
    [
      {
        type: 'TokenSpec',
        regex: /./u,
        keepLiteral: true,
        name: 'TOKEN',
        match: 'test',
      },
    ],
    {
      token: {
        type: 'TokenSpec',
        regex: /./u,
        keepLiteral: true,
        name: 'TOKEN',
        match: 'test',
      },
      tokenLength: 4,
      errors: [],
    },
  ],
]);

theories(invalidToken, [
  [
    ['Test'],
    {
      type: 'ErrorSpec',
      regex: /./u,
      message: `Illegal character T`,
      match: 'T',
    },
  ],
]);

theories(repositionErrors, [
  [
    [
      [
        { start: 3, end: 10, message: 'Error message' },
        {
          start: 1,
          end: 20,
          message: 'Error message #2',
        },
      ],
      10,
    ],
    [
      { start: 13, end: 20, message: 'Error message' },
      {
        start: 11,
        end: 30,
        message: 'Error message #2',
      },
    ],
  ],
]);
