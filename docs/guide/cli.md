# Using the CLI

The `ctx` command is the official ContextJS CLI. It handles project scaffolding, building, watching, and running code with compiler extensions.

## Available Commands

### `ctx new`

Scaffolds a new project:

```bash
ctx new api my-api
```

Creates a folder with project config, base services, and tsconfig support.

---

### `ctx build`

Compiles your project using custom transformers:

```bash
ctx build
```

Supports all TypeScript CLI flags:

```bash
ctx build --target ES2022 --noEmitOnError
```

Specify the project to build:
```bash
ctx build -p my-api 
# or
ctx build project my-api
```

---

### `ctx watch`

Watches for changes and recompiles automatically:

```bash
ctx watch
```

---

### `ctx run`

Executes the project’s entry file (while ensuring all decorators and metadata are executed):

```bash
ctx run
# or
ctx run -p my-api
# or
ctx run project my-api
```

By default `ctx run` will build the project first, but you can skip this with `--no-build` option:

```bash
ctx run -p my-api --no-build
```