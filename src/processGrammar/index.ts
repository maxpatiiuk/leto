import type { AttributeGrammar, Grammar } from '../grammar/types.js';
import { split } from '../utils/utils.js';
import { leftFactor, wrapPart } from './leftFactor.js';
import { getUniqueName } from './uniqueName.js';

/** Process grammar to turn it into LL(1) grammar */
export const postProcessGrammar = ({
  grammar,
  ...rest
}: AttributeGrammar): AttributeGrammar => ({
  grammar: leftFactor(removeLeftRecursion(grammar)),
  ...rest,
});

/**
 * Remove immediate left recursion
 */
export const removeLeftRecursion = (grammar: Grammar): Grammar =>
  Object.fromEntries(
    Object.entries(grammar).flatMap(([name, lines]) => {
      const [terminal, recursive] = split(
        lines,
        (line) => line[0].type === 'Part' && line[0].name === name
      );
      if (recursive.length === 0) return [[name, lines]];
      const uniqueName = getUniqueName(name, Object.keys(grammar));
      return [
        [
          name,
          terminal.length === 0
            ? [[wrapPart(uniqueName)]]
            : terminal.map((terminal) => [...terminal, wrapPart(uniqueName)]),
        ],
        [
          uniqueName,
          [
            ...recursive.map((recursive) => [
              ...recursive.slice(1),
              wrapPart(uniqueName),
            ]),
            [],
          ],
        ],
      ];
    })
  );
