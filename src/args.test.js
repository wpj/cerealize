import { toString } from './args';
import { dashes } from './flags';

test('toString', () => {
  expect(toString(dashes, { foo: 'bar' }, 'baz')).toBe('--foo bar baz');
  expect(toString(dashes, { foo: 'bar' })).toBe('--foo bar');
});
