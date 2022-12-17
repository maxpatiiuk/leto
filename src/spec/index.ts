import fs from 'node:fs';

import type { RA } from '../utils/types.js';
import type { Spec } from './types.js';
import { filterArray } from '../utils/types.js';

export const parseSpecFromFile = async (specPath: string): Promise<RA<Spec>> =>
  parseSpec(
    await fs.promises.readFile(specPath).then((data) => data.toString())
  );

export function parseSpec(spec: string): RA<Spec> {
  const lines = spec.trim().split('\n');
  return lines.map((line) => line.trim()).map(parseLine);
}

const reToken = /^(?<regex>.*) (?<name>\S+) (?<keep>true|false)$/u;

export function parseLine(line: string): Spec {
  const isError =
    line.includes('(ERR)') && !line.endsWith('true') && !line.endsWith('false');
  const isSkip = line.endsWith('(SKIP)');
  if (isSkip) {
    const [regex] = line.split('(SKIP)');
    return {
      type: 'SkipSpec',
      regex: parseRegEx(regex),
    };
  } else if (isError) {
    const [regex, message] = line.split('(ERR)');
    return {
      type: 'ErrorSpec',
      regex: parseRegEx(regex),
      message: parseErrorMessage(message.trim()),
    };
  } else {
    const groups = reToken.exec(line)?.groups;
    if (groups === undefined)
      throw new Error(`Unable to parse spec line: ${line}`);
    const { regex, name, keep } = groups;
    return {
      type: 'TokenSpec',
      regex: parseRegEx(regex),
      name,
      keepLiteral: keep === 'true',
    };
  }
}

/**
 * Add `^` to the start of regex string
 * Replace `\_` with " "
 * Replace `\ ` with " "
 * Replace `\"` with `"`
 * Replace `\'` with `'`
 */
export function parseRegEx(rawString: string): RegExp {
  const string = rawString.trim();
  let isEscaped = false;
  const parsedString = filterArray(
    Array.from(string, (character, index) => {
      if (character === '\\') isEscaped = !isEscaped;
      else if (isEscaped) {
        isEscaped = false;
        if (character === '_') return ' ';
      }
      if (isEscaped && ['_', ' ', '"', "'"].includes(string[index + 1]))
        return undefined;
      return character;
    })
  ).join('');
  return new RegExp(`^${parsedString}`, 'u');
}

export const parseErrorMessage = (message: string): string =>
  message.startsWith('"') && message.endsWith('"')
    ? message.slice(1, -1)
    : message;
