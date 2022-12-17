import { formatName, formatTokens } from '../formatTokens.js';
import { theories } from '../../tests/utils.js';
import { cretePositionResolver } from '../../utils/resolvePosition.js';

const positionResolver = cretePositionResolver(`
Example
Text
Here
`);

theories(formatTokens, [
  [
    [
      [
        {
          spec: {
            type: 'TokenSpec',
            match: 'AND',
            name: 'ABC',
            keepLiteral: true,
            regex: /./u,
          },
          simplePosition: 0,
        },
      ],
      positionResolver,
    ],
    'ABC:AND [1,1]',
  ],
  [
    [
      [
        {
          spec: {
            type: 'TokenSpec',
            match: 'b',
            name: 'd',
            keepLiteral: false,
            regex: /./u,
          },
          simplePosition: 2,
        },
        {
          spec: {
            type: 'TokenSpec',
            match: '10',
            name: 'INTLIT',
            keepLiteral: false,
            regex: /./u,
          },
          simplePosition: 10,
        },
      ],
      positionResolver,
    ],
    'd [2,2]\nINTLIT [3,2]',
  ],
]);

theories(formatName, [
  [
    [
      {
        type: 'TokenSpec',
        match: 'AND',
        name: 'ABC',
        keepLiteral: true,
        regex: /./u,
      },
    ],
    'ABC:AND',
  ],
  [
    [
      {
        type: 'TokenSpec',
        match: '10',
        name: 'INTLIT',
        keepLiteral: false,
        regex: /./u,
      },
    ],
    'INTLIT',
  ],
]);
