// @flow

export type Serializable = any;
export type Serializer = (key: string, value?: Serializable) => ?string;

export type Flags = { [key: string]: Serializable | Serializable[] };

/**
 * Creates a flag serializer.
 */
export function createSerializer({
  prefix,
  separator = ' ',
}: {|
  prefix: string,
  separator?: string,
|}): Serializer {
  return function option(key, value) {
    if (value === false) return null;
    return value === undefined || value === true
      ? `${prefix}${key}`
      : `${prefix}${key}${separator}${String(value)}`;
  };
}

/**
 * Serializes flag with a `-` prefix and space separator.
 *
 * @example
 * import { dashes } from 'cerealize/flags';
 * dash('k', 'value');
 * // "--k value"
 */
export const dash = createSerializer({ prefix: '-' });

/**
 * Serializes flag with a `--` prefix and space separator.
 *
 * @example
 * import { dashes } from 'cerealize/flags';
 * dashes('key', 'value');
 * // "--key value"
 */
export const dashes = createSerializer({ prefix: '--' });

/**
 * Serializes flag with a `--` prefix and `=` separator.
 *
 * @example
 * import { eq } from 'cerealize/flags';
 * eq('key', 'value');
 * // "--key=value"
 */
export const eq = createSerializer({ prefix: '--', separator: '=' });

function serializeInput(
  serializer: Serializer,
  key: string,
  value: any,
): Array<string> {
  return (Array.isArray(value)
    ? value.map(v => serializer(key, v))
    : [serializer(key, value)]
  ).filter(Boolean);
}

/**
 * Serializes flags into an array of `--key value` strings. When `serializer`
 * is a Serializer function, each flag in the the output string have the format
 * output by `serializer`. When `serializer` is a map of keys to Serializer
 * functions, each key will have the format specified by its corresponding
 * value.
 *
 * @example
 * import { dashes, toArray } from 'cerealize/flags';
 * toArray(dashes, { key: 'value' });
 * // ["--key value"]
 *
 * import { dashes, dash, toArray } from 'cerealize/flags';
 * toArray({ key: dashes, b: dash }, { key: 'value', b: 'a' });
 * // ["--key value", "-b a"]
 */
export function toArray(
  serializer: Serializer | { [prop: string]: Serializer },
  flags: Flags,
): Array<string> {
  if (typeof serializer === 'function') {
    const serialize = serializer;
    return Object.keys(flags)
      .sort()
      .reduce((serialized, key) => {
        const value = flags[key];

        return serialized.concat(serializeInput(serialize, key, value));
      }, []);
  }

  const schema = serializer;

  return Object.keys(flags)
    .sort()
    .reduce((serialized, key) => {
      // Don't handle flag if a serializer for its key is not specified in
      // the schema.
      if (!(key in schema)) return serialized;

      const serialize = schema[key];

      const value = flags[key];

      // NOTE: this should probably be moved outside the iterator
      return serialized.concat(serializeInput(serialize, key, value));
    }, []);
}

export function toString(
  serializer: Serializer | { [prop: string]: Serializer },
  flags: Flags,
) {
  return toArray(serializer, flags).join(' ');
}
