import { theories } from '../../tests/utils.js';
import {
  formatAction,
  parseActions,
  parseAttributeGrammar,
  parseGrammar,
  parseGrammarDefinition,
  parseGrammarLine,
  validateGrammar,
} from '../index.js';

describe(parseAttributeGrammar, () => {
  test('throws on extra categories', () =>
    expect(() => parseAttributeGrammar('%%')).toThrow(
      /Found 2 sections in the attribute grammar./u
    ));
  test('throws on fewer categories', () =>
    expect(() => parseAttributeGrammar('%%\n%%\n%%')).toThrow(
      /Found 4 sections in the attribute grammar./u
    ));
  test('valid grammar', () =>
    expect(parseAttributeGrammar('s ::= #1\n%%\na\n%%\n#1 { b }')).toEqual({
      grammar: {
        s: [[{ type: 'ActionReference', number: 1 }]],
      },
      initialization: 'a',
      actions: { 1: 'b' },
    }));
});

theories(parseGrammar, [
  {
    in: [
      `s ::= A
s ::= B`,
    ],
    out: {
      s: [[{ type: 'Part', name: 'A' }], [{ type: 'Part', name: 'B' }]],
    },
  },
]);

theories(parseGrammarLine, [
  {
    in: [`S   ::=   A #4`],
    out: [
      'S',
      [
        { type: 'Part', name: 'A' },
        { type: 'ActionReference', number: 4 },
      ],
    ],
  },
]);

theories(formatAction, [{ in: ['3'], out: '#3' }]);

theories(parseGrammarDefinition, [
  {
    in: ['#1'],
    out: [{ type: 'ActionReference', number: 1 }],
  },
  {
    in: ['B A #2'],
    out: [
      { type: 'Part', name: 'B' },
      { type: 'Part', name: 'A' },
      { type: 'ActionReference', number: 2 },
    ],
  },
]);

theories(parseActions, [
  {
    in: [
      `#1 { a }
#3 { 
   ;{};
   {a {} '}
}`,
    ],
    out: {
      1: 'a',
      3: `;{};
   {a {} '}`,
    },
  },
]);

describe(validateGrammar, () => {
  test('validates valid grammar withouth errors', () =>
    expect(
      validateGrammar({
        grammar: {},
        initialization: '',
        actions: {},
      })
    ).toBeUndefined());

  test('throws on invalid action references', () =>
    expect(() =>
      validateGrammar({
        grammar: {
          a: [
            [
              {
                type: 'ActionReference',
                number: 3,
              },
              { type: 'ActionReference', number: 2 },
            ],
          ],
        },
        initialization: '',
        actions: { 2: '' },
      })
    ).toThrow(`Found a reference to unknown action #3`));

  test('throws on unused action', () =>
    expect(() =>
      validateGrammar({
        grammar: {},
        initialization: '',
        actions: { 2: '' },
      })
    ).toThrow('Found unused action: #2'));
});
