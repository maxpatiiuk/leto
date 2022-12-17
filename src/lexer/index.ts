import { program } from 'commander';
import fs from 'node:fs';

import { lex } from './lex.js';
import { parseSpecFromFile } from '../spec/index.js';
import type { Spec } from '../spec/types.js';
import type { RA } from '../utils/types.js';

program.name('lexer').description('Flex');

program
  .requiredOption('-i, --input <string>', 'path to input file')
  .requiredOption('-o, --output <string>', 'path to output file')
  .requiredOption('-s, --spec <string>', 'path to language spec file');

program.parse();

const { input, output, spec } = program.opts<{
  readonly input: string;
  readonly output: string;
  readonly spec: string;
}>();

if (!fs.existsSync(input))
  throw new Error(`Input file does not exist: ${input}`);
if (!fs.existsSync(spec)) throw new Error(`Input file does not exist: ${spec}`);

parseSpecFromFile(spec)
  .then(async (specs) => tokenizeInput(input, specs))
  .then(async (result) => printResults(output, result))
  .catch(console.error);

const tokenizeInput = async (
  input: string,
  specs: RA<Spec>
): Promise<ReturnType<typeof lex>> =>
  lex(specs, await fs.promises.readFile(input).then((data) => data.toString()));

async function printResults(
  outputPath: string,
  { formattedErrors, output }: ReturnType<typeof lex>
): Promise<void> {
  if (formattedErrors.length > 0) console.error(formattedErrors);
  await fs.promises.writeFile(outputPath, output);
}
