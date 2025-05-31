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

### Creating a New WebAPI Project

```bash
ctx new api myApi
cd myApi
npm install
```

### Project Structure Example

```
myApi/
├── src/
│   ├── controllers/
│   │   └── user.controller.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   ├── services/
│   │   └── user.service.ts
│   └── index.ts
├── context.ctxp
├── package.json
└── tsconfig.json
```

### Example: Defining a REST Endpoint

```ts
// src/controllers/user.controller.ts
import { Controller, Get } from '@contextjs/webserver-middleware-controllers';

@Controller('/users')
export class UserController {
  @Get('/')
  getAll() {
    return [{ id: 1, name: 'Alice' }];
  }
}
```

### Example: Adding Middleware

```ts
// src/middleware/auth.middleware.ts
import { Middleware } from '@contextjs/webserver';

export const authMiddleware: Middleware = (ctx, next) => {
  if (!ctx.request.headers['authorization']) {
    ctx.response.status = 401;
    ctx.response.body = { error: 'Unauthorized' };
    return;
  }
  return next();
};
```

### Example: Registering Controllers and Middleware

```ts
// src/index.ts
import { createServer } from '@contextjs/webserver';
import { useControllers } from '@contextjs/webserver-middleware-controllers';
import { authMiddleware } from './middleware/auth.middleware';
import { UserController } from './controllers/user.controller';

const app = createServer();

app.use(authMiddleware);
app.use(useControllers([UserController]));

app.listen(3000, () => {
  console.log('API server running on http://localhost:3000');
});
```

## Further Reading

- [ContextJS Packages Guide](../packages.md)
- [API Reference](../../api/index.md)
- [CLI Usage](../cli.md)

---

This guide will be updated as new features and best practices emerge in the ContextJS ecosystem.
