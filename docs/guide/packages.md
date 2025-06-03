# Packages

This guide provides an overview of the available packages in the framework, along with links to their respective API documentation. Each package serves a specific purpose and can be used independently or in combination with others to build robust applications.

## Core Packages

### [@contextjs/system](../api/system.md)

Foundation utilities: `Console`, `Exception`, `Throw`, `VersionService`, argument parsing, and string/object extensions.

### [@contextjs/di](../api/di.md)

Dependency injection container with interface-based registration, constructor metadata via AST transformers, and scoped lifetimes.

### [@contextjs/context](../api/context.md)

Official CLI tool (`ctx`) for building, watching, scaffolding, and restoring projects; supports full TypeScript flag passthrough and custom transformers.

## Collections & IO

### [@contextjs/collections](../api/collections.md)

Generic, high-performance data structures: `List`, `Queue`, `Stack`, `Dictionary`, `HashSet`.

### [@contextjs/io](../api/io.md)

Filesystem abstraction with `File`, `Directory`, async read/write, and path utilities.

## Text

### [@contextjs/text](../api/text.md)

String manipulation utilities, including a segment-based `StringBuilder` with fluent chaining, formatting, and cloning support.

## Configuration

### [@contextjs/configuration](../api/configuration.md)

Configuration abstraction layer with a unified provider interface.

### [@contextjs/configuration-json](../api/configuration-json.md)

JSON configuration provider that loads environment-aware settings with fallback support.

## Routing

### [@contextjs/routing](../api/routing.md)

Advanced router supporting literal, parameter, optional, and wildcard segments with a scoring-based matcher.

## Web Server

### [@contextjs/webserver](../api/webserver.md)

High-performance, TypeScript-first HTTP/HTTPS server built directly on raw TCP sockets for maximum throughput, and zero runtime dependencies. Supports HTTP/2 with automatic HTTP/1.1 fallback, pooled contexts for minimal GC, and a robust middleware pipeline.

### [@contextjs/webserver-middleware-static](../api/webserver-middleware-static.md)

Static files middleware for the ContextJS WebServer.

### [@contextjs/webserver-middleware-cookies](../api/webserver-middleware-cookies.md)

Middleware for ContextJS WebServer that transparently handles HTTP cookies in requests and responses.

### [@contextjs/webserver-middleware-controllers](../api/webserver-middleware-controllers.md)

Controllers middleware for the ContextJS webserver.

---

For detailed API documentation, visit the [API Reference](../api/index.md).
