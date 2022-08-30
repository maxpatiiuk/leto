import { theories } from '../tests/utils.js';
import {
  parseErrorMessage,
  parseLine,
  parseRegEx,
  parseSpec,
} from './index.js';

theories(parseSpec, [
  [
    [`[A-Z] (ERR) "Some error"\n.* (SKIP)`],
    [
      {
        type: 'ErrorSpec',
        regex: /^[A-Z]/u,
        message: 'Some error',
      },
      {
        type: 'SkipSpec',
        regex: /^.*/u,
      },
    ],
  ],
]);

theories(parseLine, [
  [
    ['[A-Z] (ERR) "Some error"'],
    {
      type: 'ErrorSpec',
      regex: /^[A-Z]/u,
      message: 'Some error',
    },
  ],
  [
    ['.* (SKIP)'],
    {
      type: 'SkipSpec',
      regex: /^.*/u,
    },
  ],
  [
    ['\\t\\n A_TOKEN false'],
    {
      type: 'TokenSpec',
      regex: /^\t\n/u,
      name: 'A_TOKEN',
      keepLiteral: false,
    },
  ],
  [
    ['(ERR) Other-Token true'],
    {
      type: 'TokenSpec',
      regex: /^(ERR)/u,
      name: 'Other-Token',
      keepLiteral: true,
    },
  ],
]);

theories(parseRegEx, [
  [[`  [A-Z] `], /^[A-Z]/u],
  [[' \\_BA\\_ '], /^ BA /u],
  [[`\\ \\'\\"\\_`], /^ '" /u],
]);

theories(parseErrorMessage, [
  [['Abc'], 'Abc'],
  [['" Abc "'], ' Abc '],
]);
