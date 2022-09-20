import { theories } from '../../tests/utils.js';
import { getUniqueName } from '../uniqueName.js';

theories(getUniqueName, [
  { in: ['', []], out: '' },
  { in: ['a', []], out: 'a' },
  { in: ['a', ['a']], out: "a'" },
  { in: ['a', ['a', "a'"]], out: "a''" },
]);
