import fs from 'node:fs';

import { filterArray } from '../utils/types.js';
import { group } from '../utils/utils.js';
import type {
  AttributeGrammar,
  Grammar,
  GrammarActions,
  GrammarLine,
} from './types.js';
import { postProcessGrammar } from '../processGrammar/index.js';

const grammarSplitSymbol = /(?:^|\n)%%(?:\n|$)/mu;

export async function parseGrammarFromFile(
  grammarPath: string
): Promise<AttributeGrammar> {
  const text = await fs.promises
    .readFile(grammarPath)
    .then((data) => data.toString());
  return postProcessGrammar(parseAttributeGrammar(text));
}

export function parseAttributeGrammar(text: string): AttributeGrammar {
  const parts = text.split(grammarSplitSymbol);
  if (parts.length !== 3)
    throw new Error(
      `Found ${parts.length} sections in the attribute grammar. ` +
        `Expected 3. (%% is used to separate sections)`
    );
  const [grammar, initialization, actions] = parts;
  const attributeGrammar: AttributeGrammar = {
    grammar: parseGrammar(grammar),
    initialization,
    actions: parseActions(actions),
  };
  validateGrammar(attributeGrammar);
  return attributeGrammar;
}

export const parseGrammar = (rawGrammar: string): Grammar =>
  Object.fromEntries(
    group(rawGrammar.trim().split('\n').map(parseGrammarLine))
  );

const reGrammarLine = /^(?<name>\S+)\s+::=(?<definition>.*)$/u;

export function parseGrammarLine(
  rawLine: string
): readonly [string, GrammarLine] {
  const groups = reGrammarLine.exec(rawLine)?.groups;
  if (groups === undefined)
    throw new Error(`Unable to parse grammar line: ${rawLine}`);
  const { name, definition } = groups;
  return [name, parseGrammarDefinition(definition)];
}

export const formatAction = (number: number | string): string => `#${number}`;
const reActionReference = /^#(?<number>\d+)$/u;

export const parseGrammarDefinition = (rawDefinition: string): GrammarLine =>
  rawDefinition
    .trim()
    .split(' ')
    .map((part) => {
      const actionNumber = reActionReference.exec(part)?.groups?.number;
      return typeof actionNumber === 'string'
        ? {
            type: 'ActionReference',
            number: Number.parseInt(actionNumber),
          }
        : {
            type: 'Part',
            name: part,
          };
    });

const reAction = /^#(?<number>\d+)\s*\{(?<definition>[^\n}]+|[\S\s]+^)\}$/gmu;
export const parseActions = (actions: string): GrammarActions =>
  Object.fromEntries(
    Array.from(actions.matchAll(reAction), ({ groups }) => [
      Number.parseInt(groups!.number),
      groups!.definition.trim(),
    ])
  );

export function validateGrammar({ grammar, actions }: AttributeGrammar): void {
  const referencedActions = new Set(
    filterArray(
      Object.values(grammar)
        .flat(2)
        .map((part) =>
          part.type === 'ActionReference' ? part.number.toString() : undefined
        )
    )
  );
  Object.keys(actions).forEach((action) => {
    if (!referencedActions.has(action))
      throw new Error(`Found unused action: ${formatAction(action)}`);
  });
  Array.from(referencedActions)
    .filter((action) => !(action in actions))
    .forEach((action) => {
      throw new Error(
        `Found a reference to unknown action ${formatAction(action)}`
      );
    });
}
