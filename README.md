# dragonsdt

// TODO: update documentation
// TODO: provide "input.ag" file (Grammar)
// TODO: provide "test.tokens" file (Test token stream)
// TODO: reread the requirements

Syntax-directed translator-generator written in TypeScript.

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
./dragonsdt --help
```

Example call:

```sh
./dragonsdt --spec Drewgon.spec --executable lexer
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