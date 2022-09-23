import { wrapPart } from '../../processGrammar/leftFactor.js';
import { generateSourceCode } from '../index.js';

test('generateSourceCode', () => {
  expect(
    generateSourceCode(
      {
        grammar: {
          Expr: [
            [{ type: 'ActionReference', number: 1 }],
            [
              wrapPart('('),
              wrapPart('Expr'),
              wrapPart(')'),
              { type: 'ActionReference', number: 2 },
            ],
            [
              wrapPart('['),
              wrapPart('Expr'),
              wrapPart(']'),
              { type: 'ActionReference', number: 3 },
            ],
          ],
        },
        initialization: 'const a = 1;',
        actions: {
          1: 'console.log("a")',
          2: 'console.log("$# $#")',
          // This is not replaced because lexeme is undefined
          3: 'console.log("$#")',
        },
      },
      [
        { number: 1, lexeme: ')' },
        { number: 2, lexeme: ']]' },
        { number: 3, lexeme: undefined },
      ]
    )
  ).toBe(`const a = 1;
{ console.log("a") }
{ console.log("]] ]]") }
{ console.log("$#") }`);
});
