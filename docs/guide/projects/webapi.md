# WebAPI Project Guide

## Overview

The WebAPI project type in ContextJS provides a robust foundation for building scalable APIs using modern TypeScript. It is designed for rapid development, flexibility, and maintainability, leveraging the modular architecture and powerful features of the ContextJS ecosystem.

## Design Rationale

- **Modularity:** WebAPI projects are structured to encourage separation of concerns, making it easy to organize routes, controllers, middleware, and services.
- **Type Safety:** Built on TypeScript, ensuring strong typing across your API, from request validation to response formatting.
- **Extensibility:** Easily integrate middleware, custom logic, and third-party packages. The ContextJS DI system allows for flexible dependency management.
- **Unified Tooling:** The `ctx` CLI streamlines project creation, building, and watching, supporting custom transformers and TypeScript options out of the box.
- **Modern Standards:** Supports API endpoints, making it suitable for a wide range of backend applications.

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
│   │   └── about.controller.ts
│   |   └── home.controller.ts
│   ├── services/
│   │   ├── interfaces/
│   │   │    └── i-logger.service.ts
│   │   │    └── i-message.service.ts
│   │   └── logger.service.ts
│   │   └── message.service.ts
│   │   └── service-collection.extensions.ts
│   └── main.ts
├── context.ctxp
├── package.json
└── tsconfig.json
```
::: info
`build` and `node_modules` can be ignored in version control
:::

### Example: Defining a REST Endpoint

```typescript
// src/controllers/home.controller.ts
import { Controller, Get } from "@contextjs/webserver-middleware-controllers";
import type { ILoggerService } from "../services/interfaces/i-logger.service.js";

@Controller()
export class HomeController {
    private readonly loggerService: ILoggerService;

    public constructor(loggerService: ILoggerService) {
        this.loggerService = loggerService;
    }

    @Get("index")
    public async index() {
        this.loggerService.log("HomeController index method called");
        return "Home";
    }
}
```

### Example: Adding Middleware

```ts
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
        console.log("[MyMiddleware] Request received:", context.request.method, context.request.path);
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

- [ContextJS Packages Guide](../packages.md)
- [API Reference](../../api/index.md)
- [CLI Usage](../cli.md)

---

This guide will be updated as new features and best practices emerge in the ContextJS ecosystem.
