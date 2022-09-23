# dragonsdt

Syntax-directed translator-generator written in TypeScript.

## Prerequisites

- Node 18
- NPM 8

## Installation

Install dependencies: 

```sh
make build
```

## Running

To see available options, run the script with `--help` argument:

```sh
./dragonsdt --help
```

Example call:

```sh
./dragonsdt --grammar input.ag --executable translator
```

OR alternative:

```sh
make run
```

## Testing

To see available options, run the script with `--help` argument:

```
./translator --help
```

Example call:

```sh
./translator --tokens test.tokens --executable executable.js
node ./executable.js
```

OR alternative:

```sh
make test
```

## Unit Tests

Jest is used for unit testing.

You can run it like this:

```sh
npm test
```