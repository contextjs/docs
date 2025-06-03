# @contextjs/routing

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)&nbsp;
[![npm](https://badgen.net/npm/v/@contextjs/routing?cache=300)](https://www.npmjs.com/package/@contextjs/routing)&nbsp;
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> Declarative, extensible route matching and configuration for ContextJS-based applications.

## Features

- Fully type-safe and fluent route configuration
- Support for literal, parameterized, optional, and catch-all route templates
- Fast route matching with scoring and early-exit optimization
- URI decoding, normalization, and edge-case tolerance
- Integration with the `Application` class via `useRouting()`

## Installation

```bash
npm i @contextjs/routing
```

## Usage

```typescript
import "@contextjs/routing";

import { Route, RouteService, } from "@contextjs/routing";
import { Application } from "@contextjs/system";

const app = new Application();
app.useRouting();

export class MyRoute {
    @Route("/my-route")
    async onGet() {
        return "Hello from MyRoute!";
    }
}

app.onRun(async () => {
    console.log(app.routes);
});

await app.runAsync();
```

## Matching Example

```typescript
import "@contextjs/routing";

import { Route, RouteService, } from "@contextjs/routing";
import { Application } from "@contextjs/system";

const app = new Application();
app.useRouting();

export class MyRoute {
    @Route("home/{id?}/details")
    async onGet() {
        return "Hello from MyRoute!";
    }
}

app.onRun(async () => {
    const route = RouteService.match("home/123/details", app.routes);
    console.log(route?.definition.route.decodedTemplate); // "home/{id?}/details"
});

await app.runAsync();
```

## API Reference

### Decorator

```typescript
/**
 * Decorates a method as a route handler.
 * @param template The URL template for the route.
 * @param name The name of the route (optional).
 */
export declare function Route(template: string, name?: string): MethodDecorator;
```

### `RouteInfo`

Represents a route with a URL template and optional name.

```typescript
new RouteInfo(template: string);
new RouteInfo(template: string, name: string);
```

- `template`: The route’s URL template (e.g., `"users/{id}"`)
- `name`: Optional route name

### `RouteService`

Provides matching logic to resolve a route from a path.

```typescript
public static match(value: string, routes: RouteDefinition[]): RouteDefinition | null;
```

- `path`: Request path (e.g., `"users/42"`)
- `routes`: Array of `RouteDefinition` instances to search
- **Returns**: the best match or `null` if no match

### `Application.useRouting`

Adds routing configuration to the ContextJS `Application`.

```typescript
app.useRouting();
```


### `RouteDefinition`
```typescript
/**
 * Represents a route definition, including the import path, class reference, method name, and route information.
 */
export class RouteDefinition<T extends RouteInfo = RouteInfo> {
    /**
     * The class name of the route handler, or null if not applicable.
     * This is typically used for class-based controllers.
     */
    public readonly className: string | null;

    /**
     * The method name of the route handler, or null if not applicable.
     * This is typically used for class-based controllers.
     */
    public readonly methodName: string | null;

    /**
     * The route information, which includes the URL template and name.
     */
    public readonly route: T;

    /**
     * Creates a new route definition.
     * @param className The class name of the route handler, or null if not applicable.
     * @param methodName The method name of the route handler, or null if not applicable.
     * @param route The route information.
     */
    public constructor(className: string | null, methodName: string | null, route: T);
}
```

### `ParsedRoute`
```typescript
/**
 * Represents a parsed route, including the route definition and any parameters extracted from the path.
 */
export declare class ParsedRoute {
    /**
     * The route definition that was matched.
     */
    public readonly definition: RouteDefinition;

    /**
     * The parameters extracted from the route path.
     * This is a dictionary where keys are parameter names and values are their corresponding values.
     */
    public readonly parameters: Dictionary<string, any>;

    /**
     * Creates a new parsed route.
     * @param definition The route definition that was matched.
     * @param parameters The parameters extracted from the route path.
     */
    public constructor(definition: RouteDefinition, parameters: Dictionary<string, any>);
}
```

## Testing

All features are covered by 100% unit test coverage, ensuring reliability, correctness, and long-term maintainability - so you can focus on building, not debugging.