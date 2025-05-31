# Installation

ContextJS can be installed globally via its CLI or used as individual packages for more granular control.

## CLI Installation

To install the global CLI:

```bash
npm i -g @contextjs/context
```

This exposes the `ctx` command used for scaffolding, building, and running ContextJS projects.

## Creating a New Project

To scaffold a new project:

```bash
ctx new api myAPI
cd my-app
```

This will create a full project structure with TypeScript, `tsconfig.json`, and internal extension support out of the box.

## Using Individual Packages

All packages are published independently and can be installed as needed. For example:

```bash
npm i @contextjs/di @contextjs/system
```

## Packages

You can find a complete list of available packages in the [Packages Guide](./packages.md). Each package is designed to be modular and can be used independently or in combination with others to build robust applications.