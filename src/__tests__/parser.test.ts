import { parse } from '../parser.js';
import type { Spec } from '../grammar/types.js';
import { theories } from '../tests/utils.js';
import type { RA } from '../utils/types.js';

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

theories(parse, [
  [
    [specs, `A B`],
    {
      formattedErrors: 'FATAL [1,3]-[1,4]: Some Error',
      output: 'TOKEN:A [1,1]',
    },
  ],
]);
