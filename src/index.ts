import { program } from 'commander';
import fs from 'node:fs';

import { parse } from './parser.js';
import { parseGrammarFromFile } from './grammar/index.js';
import type { Spec } from './grammar/types.js';
import type { RA } from './utils/types.js';

program.name('dragonlex').description('Trial #2 - STD');

program
  .requiredOption('-t, --tokens <string>', 'path to token stream file')
  .requiredOption('-g, --grammar <string>', 'path to attribute grammar file')

program.parse();

const { tokens, grammar } = program.opts<{
  readonly tokens: string;
  readonly grammar: string;
}>();

if (!fs.existsSync(tokens))
  throw new Error(`Tokens stream file does not exist: ${tokens}`);
if (!fs.existsSync(grammar)) throw new Error(`Attribute grammar file does not exist: ${grammar}`);

parseGrammarFromFile(grammar)
  .then(async (specs) => parseInput(tokens, specs))
  .then(printResults)
  .catch(console.error);

const parseInput = async (
  input: string,
  specs: RA<Spec>
): Promise<ReturnType<typeof parse>> =>
  parse(
    specs,
    await fs.promises.readFile(input).then((data) => data.toString())
  );

function printResults(
  { formattedErrors, output }: ReturnType<typeof parse>
): void {
  if (formattedErrors.length > 0) console.error(formattedErrors);
  else console.log(output);
}
