import type { AttributeGrammar } from '../grammar/types.js';
import type { Steps } from '../parse/index.js';
import type { RA } from '../utils/types.js';

/**
 * Note, the lexeme replacers in string literals and comments are replaced too
 */
const leximmeReplacer = '$#';

export function generateSourceCode(
  spec: AttributeGrammar,
  steps: RA<Steps>
): string {
  const { initialization, actions } = spec;
  const actionLines = steps.map(({ number, lexeme }) => {
    const action = actions[number];
    return lexeme === undefined
      ? action
      : action.replaceAll(leximmeReplacer, lexeme);
  });
  return `${initialization}\n${actionLines
    .map((entry) => `{ ${entry} }`)
    .join('\n')}`;
}
