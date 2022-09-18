/**
 * Create a bash command for running a lexer with curried arguments
 */

import { program } from 'commander';
import fs from 'node:fs';

program.name('dragonsdt').description('Trial #2 - STD');

program
  .requiredOption('-t, --tokens <string>', 'path to token stream file')
  .requiredOption('-g, --grammar <string>', 'path to attribute grammar file')
  .requiredOption(
    '-e, --executable <string>',
    'name of the output executable file'
  );

program.parse();

const {
  tokens = '',
  grammar = '',
  executable,
} = program.opts<{
  readonly tokens?: string;
  readonly grammar?: string;
  readonly executable: string;
}>();

fs.promises
  .writeFile(
    executable,
    `#!/bin/sh
node --loader ts-node/esm src/index.ts \
  ${grammar.length > 0 ? `--grammar ${grammar}` : ''} \
  ${tokens.length > 0 ? `--input ${tokens}` : ''} \
  "$@"
`
  )
  .then(() => fs.chmodSync(executable, '755'))
  .catch(console.error);

// Make file executable
