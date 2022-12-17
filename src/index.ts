import { program } from 'commander';
import fs from 'node:fs';

import type { PureGrammar } from './firstFollowSets/firstSets.js';
import { getFirstSets, toPureGrammar } from './firstFollowSets/firstSets.js';
import { getFollowSets } from './firstFollowSets/followSets.js';
import { generateSourceCode } from './generator/index.js';
import { parseGrammarFromFile } from './grammar/index.js';
import { parse } from './parse/index.js';
import { buildParseTable } from './parseTable/build.js';
import type { Token } from './tokenizer/index.js';
import { tokenize } from './tokenizer/index.js';
import type { RA } from './utils/types.js';

program.name('lexer').description('STD');

// TODO: update README.md documentation (and extend it)
// TODO: add link back to dgc project
program
  .requiredOption('-t, --tokens <string>', 'path to token stream file')
  .requiredOption('-g, --grammar <string>', 'path to attribute grammar file')
  .requiredOption(
    '-e, --executable <string>',
    'name of the executable to create'
  );

program.parse();

const { tokens, grammar, executable } = program.opts<{
  readonly tokens: string;
  readonly grammar: string;
  readonly executable: string;
}>();

if (!fs.existsSync(tokens))
  throw new Error(`Tokens stream file does not exist: ${tokens}`);
if (!fs.existsSync(grammar))
  throw new Error(`Attribute grammar file does not exist: ${grammar}`);

parseGrammarFromFile(grammar)
  .then(async (spec) => {
    const pureGrammar = toPureGrammar(spec.grammar);
    const firstSets = getFirstSets(pureGrammar);
    const followSets = getFollowSets(pureGrammar, firstSets);
    const parseTable = buildParseTable(pureGrammar, firstSets, followSets);
    const tokenStream = await tokenizeInput(tokens, pureGrammar);
    const actions = parse(spec.grammar, parseTable, tokenStream);
    const javaScript = generateSourceCode(spec, actions);
    await fs.promises.writeFile(executable, javaScript);
    return fs.promises.chmod(executable, '755');
  })
  .catch(console.error);

const tokenizeInput = async (
  input: string,
  grammar: PureGrammar
): Promise<RA<Token>> =>
  tokenize(
    await fs.promises.readFile(input).then((data) => data.toString()),
    grammar
  );
