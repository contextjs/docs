# Using the CLI

The `ctx` command is the official ContextJS CLI. It handles project scaffolding, building, watching, and running code with compiler extensions.

## Available Commands

### `ctx new`

Scaffolds a new project:

```bash
ctx new my-app
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
```

This allows you to register controllers and services directly in your main file.

---

## Transformers

All internal transformers (e.g., DI registration, route discovery) are loaded automatically. You can also add custom ones via `.ctxp` config or CLI flags.
