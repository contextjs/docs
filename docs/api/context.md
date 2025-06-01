# @contextjs/context  
<br>

<a href="https://github.com/contextjs/context/actions/workflows/tests.yaml"><img src="https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main" /></a>&nbsp;
<a href="https://www.npmjs.com/package/@contextjs/context"><img src="https://badgen.net/npm/v/@contextjs/context?cache=300" /></a>&nbsp;
<a href="https://github.com/contextjs/context/blob/main/LICENSE"><img src="https://badgen.net/static/license/MIT" /></a>


Official CLI for building and managing ContextJS projects.

## Features

- Unified command-line interface for managing ContextJS-based projects  
- Support for creating new projects from templates  
- Project-wide or selective build and watch support  
- Supports all TypeScript compiler flags via `ctx build` and `ctx watch`  
- Supports custom and external transformers via `--transformers` or `context.ctxp`  
- Works seamlessly with all ContextJS packages  

## Installation

Install globally via npm:

```bash
npm i -g @contextjs/context
```

This exposes the `ctx` command globally in your terminal.

## Usage

### Display available options

```bash
ctx
```

### Display version

```bash
ctx version
```

### New project

These commands are equivalent:
```bash
ctx new api my-api
ctx new api -n my-api
ctx new api --name my-api
```

If no argument is passed for the API name, the current folder name will be used:

```bash
ctx new api
```

If no arguments are passed at all, the help message will be shown:

```bash
ctx new
```

### Build

Build all detected projects:

```bash
ctx build
```

Build specific projects:

```bash
ctx build -p myApi1 myApi2 ...
```

You can pass TypeScript compiler options directly:

```bash
ctx build --noEmitOnError --target ES2022
```

Use a custom transformer:

```bash
ctx build --transformers=./src/my-transformer.ts
```

Or define transformers in `context.ctxp`:

```json
{
  "compilerOptions": {
    "transformers": ["./src/my-transformer.ts"]
  }
}
```

### Watch

Watch and rebuild all projects on file changes:

```bash
ctx watch
```

Watch specific projects:

```bash
ctx watch -p myApi1 myApi2 ...
```

You can also include TypeScript flags with `watch`:

```bash
ctx watch --moduleResolution NodeNext --strict true
```

External transformers are also supported in watch mode:

```bash
ctx watch --transformers=./src/my-transformer.ts
```

## Project types

ContextJS is in active development, and the CLI is designed to support various project types. For a complete list of available project types, refer to the [Projects Section](/guide/projects/).