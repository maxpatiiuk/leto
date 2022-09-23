/**
 * Create a bash command for running a lexer with curried arguments
 */

import { program } from 'commander';
import fs from 'node:fs';

program.name('dragonsdt').description('Trial #2 - STD');

program
  .requiredOption('-g, --grammar <string>', 'path to attribute grammar file')
  .requiredOption(
    '-e, --executable <string>',
    'name of the output executable file'
  );

program.parse();

const { grammar, executable } = program.opts<{
  readonly grammar: string;
  readonly executable: string;
}>();

fs.promises
  .writeFile(
    executable,
    `#!/bin/sh
node --loader ts-node/esm src/index.ts --grammar ${grammar} "$@"
`
  )
  .then(() => fs.chmodSync(executable, '755'))
  .catch(console.error);

// Make file executable
