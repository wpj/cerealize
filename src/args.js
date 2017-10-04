// @flow

import { toArray as toFlagsArray, type Serializer, type Flags } from './flags';

/**
 * Serializes flags and input as an array of strings.
 */
export function toArray(
  serializer: Serializer | { [prop: string]: Serializer },
  flags: Flags,
  input: string,
): Array<string> {
  const serialized = toFlagsArray(serializer, flags);
  return input ? serialized.concat(input) : serialized;
}

/**
 * Serializes flags and input as a string.
 */
export default function toString(
  serializer: Serializer,
  flags: Flags,
  input: string,
): string {
  return toArray(serializer, flags, input).join(' ');
}
