import cases from 'jest-in-case';

import { dash, dashes, eq, toArray, toString } from './flags';

cases(
  'dash',
  ({ input, expected }) => expect(dash('f', input)).toBe(expected),
  [
    { name: 'bare', input: undefined, expected: '-f' },
    { name: 'true', input: true, expected: '-f' },
    { name: 'string', input: 'md', expected: '-f md' },
    { name: 'falsy', input: 0, expected: '-f 0' },
    { name: 'false', input: false, expected: null },
  ],
);

cases(
  'dashes',
  ({ input, expected }) => expect(dashes('format', input)).toBe(expected),
  [
    { name: 'bare', input: undefined, expected: '--format' },
    { name: 'true', input: true, expected: '--format' },
    { name: 'string', input: 'markdown', expected: '--format markdown' },
    { name: 'falsy', input: 0, expected: '--format 0' },
    { name: 'false', input: false, expected: null },
  ],
);

cases(
  'eq',
  ({ input, expected }) => expect(eq('format', input)).toBe(expected),
  [
    { name: 'string', input: 'markdown', expected: '--format=markdown' },
    { name: 'false', input: false, expected: null },
  ],
);

const toTypeCases = [
  {
    name: 'accepts single Serializer function',
    serializer: dashes,
    input: { foo: 'bar', bar: false, baz: null },
    expected: ['--baz null', '--foo bar'],
  },
  {
    name: 'handles input where flags have multiple values',
    serializer: dashes,
    input: { foo: ['bar', 'baz'] },
    expected: ['--foo bar', '--foo baz'],
  },
  {
    name: 'accepts map of keys to Serializers',
    serializer: { foo: dashes, bar: eq, b: dash },
    input: { foo: 'bar', bar: 'baz', b: 'bah' },
    expected: ['-b bah', '--bar=baz', '--foo bar'],
  },
  {
    name: "strips flags that aren't defined in the schema",
    serializer: { foo: dashes },
    input: { foo: 'bar', bar: 'baz' },
    expected: ['--foo bar'],
  },
];

cases(
  'toArray',
  ({ serializer, input, expected }) =>
    expect(toArray(serializer, input)).toEqual(expected),
  toTypeCases,
);

cases(
  'toString',
  ({ serializer, input, expected }) =>
    expect(toString(serializer, input)).toEqual(expected.join(' ')),
  toTypeCases,
);
