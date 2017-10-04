# cerealize

Serialize CLI arguments.

## Install

npm:

```sh
$ npm install --save cerealize
```

yarn:

```sh
$ yarn add cerealize
```

## Usage

```javascript
import toString from 'cerealize';
import { dashes, eq } from 'cerealize/flags';

console.log(toString(dashes, { format: 'markdown' }, './file.js'));
// '--format markdown ./file.js'


console.log(
  toString({ format: eq, c: dash }, { format: 'markdown', c: 1 }, './file.js'),
);
// '--format=markdown -c 1 ./file.js'
```
