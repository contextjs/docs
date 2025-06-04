# WebAPI Project Guide

## Overview

The WebAPI project type in ContextJS provides a robust foundation for building scalable APIs with modern TypeScript. It enables rapid development, strong type safety, modular architecture, and flexible extensibility—leveraging the best practices of the ContextJS ecosystem.

## Design Rationale

* **Modularity:** Structure your application by separating routes, controllers, middleware, and services.
* **Type Safety:** Built with TypeScript, providing strong typing from request to response.
* **Extensibility:** Integrate custom middleware and logic with ease. The ContextJS DI system supports flexible dependency injection.
* **Unified Tooling:** The `ctx` CLI streamlines project creation, building, and watching, supporting custom transformers and TypeScript options.
* **RESTful Standards:** Easily define API endpoints with idiomatic HTTP status codes and clear action result patterns.

## Getting Started

### Create a New WebAPI Project

```bash
ctx new api my-api
ctx run
```

### Project Structure Example

```
my-api/
├── build         
├── node_modules  
├── src/
│   ├── controllers/
│   │   ├── about.controller.ts
│   │   └── home.controller.ts
│   ├── services/
│   │   ├── interfaces/
│   │   │   ├── i-logger.service.ts
│   │   │   └── i-message.service.ts
│   │   ├── logger.service.ts
│   │   ├── message.service.ts
│   │   └── service-collection.extensions.ts
│   └── main.ts
├── context.ctxp
├── package.json
└── tsconfig.json
```

::: info
`build` and `node_modules` should be excluded from version control.
:::

### Example: Defining a REST Endpoint

```typescript
// src/controllers/home.controller.ts
import { Controller, Get, BadRequest, Ok, NotFound } from "@contextjs/webserver-middleware-controllers";
import type { ILoggerService } from "../services/interfaces/i-logger.service.js";

@Controller()
export class HomeController {
    public constructor(private readonly loggerService: ILoggerService) {}

    @Get("index")
    public async index() {
        this.loggerService.log("HomeController index method called");
        return Ok("Home"); // Use Ok() for 200 responses
    }

    @Get("error")
    public async error() {
        return BadRequest("Invalid request example"); // Use BadRequest() for 400 responses
    }

    @Get("missing")
    public async missing() {
        return NotFound(); // Use NotFound() for 404 responses
    }
}
```

### Example: Using Other Built-in Results

ContextJS includes action results for common HTTP status codes:

| Result Type                           | Description                                |
| ------------------------------------- | ------------------------------------------ |
| `Ok(value)`                           | 200 OK with optional string body           |
| `Json(value)`                         | 200 OK with JSON body                      |
| `Created(value, location)`            | 201 Created, with optional Location header |
| `NoContent()`                         | 204 No Content                             |
| `Empty()`                             | End response, preserve status              |
| `BadRequest(message)`                 | 400 Bad Request with optional message      |
| `Unauthorized()`                      | 401 Unauthorized                           |
| `Forbidden()`                         | 403 Forbidden                              |
| `NotFound()`                          | 404 Not Found                              |
| `Content(body, type, status, reason)` | Custom status/content-type/body            |

**Example usage in controllers:**

```typescript
return Ok("Success!");
return Json({ user: "bob" });
return Created("Resource created!", "/api/resource/123");
return NoContent();
return BadRequest("Missing parameter");
return Unauthorized();
return Forbidden();
return NotFound();
return Content("<b>Hello</b>", "text/html");
```

::: tip
When using `Json(value)`, always pass plain objects, arrays, or primitives—not pre-stringified JSON strings. If you pass a string (such as `'{"foo":123}'`), it will be JSON-stringified again, resulting in a double-encoded JSON value (wrapped in extra quotes). For raw strings, use `Ok(value)` or `Content(value, "text/plain")` instead.
:::

### Example: Adding Middleware

```typescript
// src/main.ts
import "@contextjs/webserver";
import "@contextjs/webserver-middleware-controllers";
import "./services/service-collection.extensions.js";

import { Application } from "@contextjs/system";
import { HttpContext, IMiddleware, WebServerOptions } from "@contextjs/webserver";

const application = new Application();

const myMiddleware: IMiddleware = {
    name: "MyMiddleware",
    version: "1.0.0",
    onRequest: (context: HttpContext) => {
        console.log("[MyMiddleware] Request:", context.request.method, context.request.path);
    }
};

application.useWebServer((options: WebServerOptions) => {
    options.onEvent = (event) => console.log(event.type, event.detail);
    options.useMiddleware(myMiddleware);
    options.useControllers();
});

application.services.registerServices();

await application.runAsync();
```

## Further Reading

* [ContextJS Packages Guide](../packages.md)
* [API Reference](../../api/index.md)
* [CLI Usage](../cli.md)