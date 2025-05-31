# Core Concepts

ContextJS is built on a set of clean, unified principles. This section introduces the most important ones.

## Dependency Injection

At the heart of ContextJS is an object-oriented DI system inspired by C# and Java:

- Register services via `.addSingleton()`, `.addTransient()`, etc.
- Resolve automatically using constructor metadata
- Scopes and lifetimes handled internally

```ts
services.addSingleton<ILogger, ConsoleLogger>();
services.addTransient<MyController>();
```

## Lifecycle

Objects are created based on their registered lifetime:

- **Singleton**: Single instance per app
- **Transient**: New instance per request
- **Scoped** *(planned)*: Per-request lifetime (e.g. per HTTP request)

## Compiler Extensions

You can extend the TypeScript compiler with custom behavior:

- Automatically extract DI metadata
- Transform service registrations
- Discover routes from decorators

All done via AST transformers, fully integrated with the `ctx build` command.

## Route Mapping

Controllers and route handlers are discovered automatically using decorators:

```ts
@Controller('products')
export class ProductController {
  @Get(':id')
  async getById() { ... }
}
```

The routing engine scores paths and chooses the most specific match.

## Unified Type Safety

Every public ContextJS API is fully typed and documented using `.d.ts` with JSDoc comments. This enables:

- Auto-complete
- Refactoring safety
- Self-documenting code
