/**
 * Create a bash command for running a lexer with curried arguments
 */

import { program } from 'commander';
import fs from 'node:fs';

program.name('dragonsdt').description('Trial #2 - STD');

program
  .option('-i, --input <string>', 'path to input file')
  .option('-o, --output <string>', 'path to output file')
  .option('-s, --spec <string>', 'path to language spec file')
  .requiredOption(
    '-e, --executable <string>',
    'name of the output executable file'
  );

program.parse();

const {
  input = '',
  output = '',
  spec = '',
  executable,
} = program.opts<{
  readonly input?: string;
  readonly output?: string;
  readonly spec?: string;
  readonly executable: string;
}>();

fs.promises
  .writeFile(
    executable,
    `#!/bin/sh
node --loader ts-node/esm src/index.ts \
  ${spec.length > 0 ? `--spec ${spec}` : ''} \
  ${input.length > 0 ? `--input ${input}` : ''} \
  ${output.length > 0 ? `--output ${output}` : ''} \
  "$@"
`
  )
  .then(() => fs.chmodSync(executable, '755'))
  .catch(console.error);

// Make file executable
