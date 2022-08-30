# dragonlex

Scanner-Generator based on Flex.

Written in TypeScript.

## Prerequisites

- Node 18
- NPM 8

## Installation

Install dependencies: 

```sh
make
```

## Running

To see available options, run the script with `--help` argument:

```sh
./dragonlex --help
```

Example call:

```sh
./dragonlex --spec Drewgon.spec --executable lexer
```

OR alternative:

```sh
make run
```

## Testing

To see available options, run the script with `--help` argument:

```
./lexer --help
```

Example call:

```sh
./lexer --input test.txt --output test.tokens
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