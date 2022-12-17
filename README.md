# leto

This is a two part project that allows to create a lexer and a parser
(with syntax directed translation) for an arbitrary
[LL(1)](https://en.wikipedia.org/wiki/LL_grammar) programming language.

## Prerequisites

- Node 18
- NPM 8

## Installation

Install dependencies:

```sh
npm install
```

## Lexer

Scanner-Generator. Syntax is based on that of
[Flex](https://www.cs.princeton.edu/~appel/modern/c/software/flex/flex.html).

Example spec is provided in [`./fixtures/lexer.spec`](./fixtures/lexer.spec)

// TODO: provide spec here

## Running Lexer

To see available options, run the script with the `--help` argument:

```sh
./lexer --help
```

Example call:

```sh
./lexer --spec fixtures/leto.spec --input fixtures/in.leto --output fixtures/out.tokens
```

## Parser & Syntax-Directed Translator

Syntax-directed translator-generator written in TypeScript.

Uses [LL(1)](https://en.wikipedia.org/wiki/LL_grammar) parser.

### Running Parser

To see available options, run the script with the `--help` argument:

```sh
./parser --help
```

Example call:

```sh
# fixtures/out.tokens is generated when running the lexer
./parser --grammar fixtures/parser.spec --tokens fixtures/out.tokens --executable fixtures/executable.js
node ./fixtures/executable.js
```

## Unit Tests

Jest is used for unit testing.

You can run it like this:

```sh
npm test
```

## Naming

Project name comes from Leto Atreides II from the Dune science fiction series.