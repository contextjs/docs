# @contextjs/webserver

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)&nbsp;
[![npm](https://badgen.net/npm/v/@contextjs/webserver?cache=300)](https://www.npmjs.com/package/@contextjs/webserver)&nbsp;
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> High-performance, TypeScript-first HTTP/HTTPS server built directly on raw TCP sockets for maximum throughput, and zero runtime dependencies. Supports HTTP/2 with automatic HTTP/1.1 fallback, pooled contexts for minimal GC, and a robust middleware pipeline.

Designed to integrate seamlessly into the ContextJS ecosystem or run standalone.

## Table of Contents

1. [Installation](#installation)  
2. [Features](#features) 
3. [Benchmarks](#benchmarks)  
   - [Summary](#summary)  
   - [Extended Metrics](#extended-metrics)
4. [Quick Start](#quick-start)  
   - [Standalone Usage](#standalone-usage)  
   - [Application Integration](#application-integration)  
5. [Basic Middleware Example](#basic-middleware-example)  
6. [Streaming a File](#streaming-a-file)  
7. [Configuration Reference](#configuration-reference)  
8. [API Reference](#api-reference)  
9. [Events](#events)  
10. [Exceptions](#exceptions)  

## Installation

```bash
npm i @contextjs/webserver
```

## Features

- **Socket-based core** leveraging raw TCP sockets for lowest-level performance  
- **HTTP and HTTPS support** with PEM-encoded certificates  
- **Middleware pipeline** for modular request handling  
- **Context pooling** for reusing `HttpContext` instances  
- **Configurable header limits** and **idle socket cleanup**  
- **Lifecycle events** (`info`, `warning`, `error`) for observability  
- **TypeScript declarations** with full JSDoc support  
- **Zero dependencies** for maximum performance and minimal footprint

## Quick Start

### Standalone Usage

```typescript
import { HttpContext, HttpWebServerOptions, WebServer, WebServerOptions } from "@contextjs/webserver";

const options = new WebServerOptions(
    undefined,
    new HttpWebServerOptions(true, "0.0.0.0", 3000, 60_000)
);

const server = new WebServer(options);

// Simple middleware
server.useMiddleware({
    name: "hello-world",
    async onRequest(context: HttpContext) {
        await context.response
            .setHeader("Content-Type", "text/plain")
            .sendAsync("Hello, ContextJS!");
    }
});

server.startAsync()

setTimeout(async () => {
    await server.stopAsync();
    console.log("Server stopped after 60 seconds");
}, 60000);
```

### Application Integration

If you’re using the ContextJS `Application` from `@contextjs/system`, you can wire up the server directly:

```typescript
import "@contextjs/webserver"; // module augmentation
import { Application } from "@contextjs/system";
import { HttpContext } from "@contextjs/webserver";

const app = new Application();

app.useWebServer(options => {
    options.http.port = 8080;
    options.onEvent = e => console.log(`[WebServer:${e.type}]`, e.detail);
});

app.webServer.useMiddleware({
    name: "logger",
    version: "1.0.0",
    onRequest(context: HttpContext) {
        console.log(`${context.request.method} ${context.request.path}`);
        context.response
            .setHeader("Content-Type", "text/plain")
            .setHeader("X-ContextJS", "Hello World")
            .sendAsync("Hello, ContextJS!");
    }
});

await app.runAsync();
```

### Streaming a File

```typescript
app.webServer.useMiddleware({
    name: "static-file",
    version: "1.0.0",
    async onRequest(context: HttpContext, next: () => Promise<void>) {
        if (context.request.path.startsWith("/assets/")) {
            const filePath = path.join(__dirname, context.request.path);
            return await context.response
                .setHeader("Content-Type", "application/octet-stream")
                .streamAsync(createReadStream(filePath));
        }
        await next();
    }
});
```

## Configuration Reference

### `WebServerOptions`

| Property | Type                         | Description                                                  |
| -------- | ---------------------------- | ------------------------------------------------------------ |
| `general`| `GeneralWebServerOptions`    | Header limits, pool size, idle socket timeout                |
| `http`   | `HttpWebServerOptions`       | HTTP binding: port, host, keep-alive                         |
| `https`  | `HttpsWebServerOptions`      | HTTPS binding: port, host, keep-alive, SSL certificate       |
| `onEvent`| `(event: WebServerEvent)`    | Callback for `info` / `warning` / `error` events             |

### `GeneralWebServerOptions`

- `maximumHeaderSize: number` — max header bytes (default: 32 * 1024)  
- `httpContextPoolSize: number` — pre-allocate contexts (default: 1024)  
- `idleSocketsTimeout: number` — ms before closing idle sockets (default: 5000)  

### `HttpWebServerOptions`

- `enabled: boolean` — enable HTTP (default: true)  
- `host?: string` — bind address (default: "localhost")  
- `port: number` — port number (default: 80)  
- `keepAliveTimeout: number` — ms for connection keep-alive (default: 5000)  

### `HttpsWebServerOptions`

- `enabled: boolean` — enable HTTPS (default: false)  
- `host?: string` — bind address (default: "localhost")  
- `port: number` — port number (default: 443)  
- `certificate: { key: string; cert: string }` — PEM key & cert  
- `keepAliveTimeout: number` — ms for connection keep-alive (default: 5000)  


## API Reference

```typescript
/**
 * Augment the base Application to integrate ContextJS WebServer.
 */
declare module "@contextjs/system" {
    export interface Application {
        /**
         * Configure and attach a WebServer to the application.
         * @param options Callback to configure WebServerOptions.
         * @returns The Application instance for chaining.
         */
        useWebServer(options: (webserverOptions: WebServerOptions) => void): Application;
        /**
         * The active WebServer instance attached to the application.
         */
        webServer: WebServer;
    }
}

/**
 * HTTP verb types for routing and middleware.
 */
export declare enum HttpVerb {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

/**
 * Protocol types for network communication.
 * Used to distinguish between HTTP and HTTPS.
 */
export declare type Protocol = "HTTP" | "HTTPS";

/**
 * Core HTTP/HTTPS server for handling requests and middleware pipeline.
 */
export declare class WebServer {
    /**
     * The application instance associated with the WebServer.
     */
    public application: Application;

    /**
     * Create a new WebServer with the given configuration options.
     * @param options The WebServerOptions to apply settings and certificates.
     */
    public constructor(options: WebServerOptions);

    /**
     * Register a middleware component to be invoked on each request.
     * @param middleware The middleware implementation.
     * @returns The WebServer instance for chaining.
     */
    public useMiddleware(middleware: IMiddleware): this;

    /**
     * Start listening for connections based on configured HTTP/HTTPS options.
     */
    public startAsync(): Promise<void>;

    /**
     * Stop the server, waiting for active connections to close.
     */
    public stopAsync(): Promise<void>;

    /**
     * Restart the server by stopping and then starting again.
     */
    public restartAsync(): Promise<void>;

    /**
     * Wait until the server is actively listening for connections.
     */
    public waitUntilListening(): Promise<void>;
}

/**
 * Configuration root for WebServer, including general, HTTP, HTTPS, and event callbacks.
 */
export declare class WebServerOptions {
    /**
     * Reference to the associated WebServer instance.
     */
    public webServer: WebServer;
    /**
     * General settings affecting header sizes, pooling, and timeouts.
     */
    public general: GeneralWebServerOptions;
    /**
     * HTTP-specific network settings.
     */
    public http: HttpWebServerOptions;
    /**
     * HTTPS-specific network settings and SSL certificate.
     */
    public https: HttpsWebServerOptions;
    /**
     * Callback invoked for informational, warning, and error events.
     */
    public onEvent: (event: WebServerEvent) => void;

    /**
     * Initialize WebServerOptions with optional sub-settings and event handler.
     * @param general GeneralWebServerOptions overrides.
     * @param http HttpWebServerOptions overrides.
     * @param https HttpsWebServerOptions overrides.
     * @param onEvent Event callback for server lifecycle events.
     */
    public constructor(
        general?: GeneralWebServerOptions,
        http?: HttpWebServerOptions,
        https?: HttpsWebServerOptions,
        onEvent?: (event: WebServerEvent) => void);
}

/**
 * General configuration options for max header size, context pool, and idle socket cleanup.
 */
export declare class GeneralWebServerOptions {
    /**
     * Maximum size (bytes) allowed for incoming request headers.
     */
    public maximumHeaderSize: number;
    /**
     * Number of pre-allocated HttpContext objects in the pool.
     */
    public httpContextPoolSize: number;
    /**
     * Time (ms) after which idle sockets are closed.
     */
    public idleSocketsTimeout: number;

    /**
     * Create general server settings.
     * @param maximumHeaderSize Maximum header byte length.
     * @param httpContextPoolSize Number of contexts to pool.
     * @param idleSocketsTimeout Idle socket timeout in milliseconds.
     */
    public constructor(maximumHeaderSize?: number, httpContextPoolSize?: number, idleSocketsTimeout?: number);
}

/**
 * Base class for HTTP and HTTPS endpoint settings.
 */
export declare class WebServerOptionsBase {
    /**
     * Whether this protocol (HTTP/HTTPS) is enabled.
     */
    public enabled: boolean;
    /**
     * Port number to bind the server socket.
     */
    public port: number;
    /**
     * Optional hostname or IP address to bind.
     */
    public host?: string;
    /**
     * Keep-alive timeout (ms) for persistent connections.
     */
    public keepAliveTimeout: number;
}

/**
 * HTTP-specific network settings.
 */
export declare class HttpWebServerOptions extends WebServerOptionsBase {
    /**
     * Construct HTTP settings with defaults or overrides.
     * @param enabled Toggle HTTP support (default: true).
     * @param host Bind address (default: "localhost").
     * @param port Port number (default: 80).
     * @param keepAliveTimeout Connection keep-alive ms.
     */
    public constructor(enabled?: boolean, host?: string, port?: number, keepAliveTimeout?: number);
}

/**
 * HTTPS-specific network settings, including SSL certificate.
 */
export declare class HttpsWebServerOptions extends WebServerOptionsBase {
    /**
     * SSL certificate key and chain for encrypted connections.
     */
    public certificate: SSLCertificate;

    /**
     * Construct HTTPS settings with optional SSL certificate and overrides.
     * @param enabled Toggle HTTPS support (default: false).
     * @param host Bind address (default: "localhost").
     * @param port Port number (default: 443).
     * @param certificate SSL key and cert strings.
     * @param keepAliveTimeout Connection keep-alive ms.
     */
    public constructor(
        enabled?: boolean,
        host?: string,
        port?: number,
        certificate?: SSLCertificate,
        keepAliveTimeout?: number);
}

/**
 * SSL certificate definition for TLS handshake.
 */
export declare type SSLCertificate = {
    /**
     * PEM-encoded private key.
     */
    key: string;
    /**
     * PEM-encoded certificate chain.
     */
    cert: string;
};

/**
 * Middleware implementation to handle request lifecycle events.
 */
export declare interface IMiddleware {
    /**
     * Unique name of the middleware.
     */
    name: string;
    /**
     * Optional semantic version for ordering or compatibility.
     */
    version?: string;

    /**
     * Handler invoked for each incoming HTTP context.
     * @param httpContext The active request/response context.
     * @param next Optional continuation callback to invoke next middleware.
     */
    onRequest(httpContext: HttpContext, next?: () => Promise<void> | void): Promise<void> | void;
}
```

### Classes

```typescript
/**
 * Events emitted by the WebServer during operation.
 */
export type WebServerEvent =
    | { type: "info"; detail: unknown }
    | { type: "warning"; detail: unknown }
    | { type: "error"; detail: unknown };

/**
 * Collection of HTTP headers with case-insensitive lookups.
 */
export declare class HeaderCollection {
    /**
     * Get the header value for the given name.
     * @param name Header name (case-insensitive).
     * @returns The header value or undefined if not present.
     */
    public get(name: string): string | undefined;

    /**
     * Set a header value, overwriting existing values.
     * @param name Header name.
     * @param value Header value string.
     */
    public set(name: string, value: string): void;

    /**
     * Determine if a header exists.
     * @param name Header name.
     */
    public has(name: string): boolean;

    /**
     * Iterate over normalized header entries as [name, value].
     */
    public entries(): IterableIterator<[string, string]>;

    /**
     * Iterate over original header entries preserving casing.
     */
    public originalEntries(): IterableIterator<[string, string]>;

    /**
     * Iterate over values with both original name and value.
     */
    public values(): IterableIterator<{ originalName: string; value: string }>;

    /**
     * Remove all headers from the collection.
     */
    public clear(): void;
}

/**
 * Request summary exposing method, path, and headers.
 */
export declare class Request {
    /**
     * Protocol used for the request (HTTP or HTTPS).
     */
    public protocol: Protocol;

    /**
     * Hostname or IP address of the request origin.
     */
    public host: string;

    /**
     * Port number of the request origin.
     */
    public port: number;

    /**
     * HTTP method (GET, POST, etc.).
     */
    public readonly method: string;

    /**
     * Parsed request headers.
     */
    public readonly headers: HeaderCollection;

    /**
     * The full request URL path including query parameters.
     * Example: "/api/resource?param=value"
     */
    public body: Readable;

    /**
     * The path of the request, excluding query parameters.
     */
    public get path(): string;

    /**
     * The raw query string from the request URL.
     */
    public get rawQuery(): string;

    /**
     * Parsed query parameters as a dictionary.
     * Keys are parameter names, values are single or array of values.
     */
    public get queryParams(): Dictionary<string, string | string[]>;
}

/**
 * Response builder for status, headers, and payload.
 */
export declare class Response {
    /**
     * Modifiable collection of response headers.
     */
    public headers: HeaderCollection;

    /**
     * HTTP status code to send (e.g., 200, 404).
     */
    public statusCode: number;

    /**
     * HTTP status message corresponding to the status code.
     */
    public statusMessage: string;

    /**
     * Set status code and optional reason phrase.
     * @param code Numeric HTTP status code.
     * @param message Optional reason phrase (default from code).
     * @returns The Response instance for chaining.
     */
    public setStatus(code: number, message?: string): this;

    /**
     * Add or override a header on the response.
     * @param nameHeader name of the response header.
     * @param value Header value(s), joined if array.
     * @returns The Response instance for chaining.
     */
    public setHeader(name: string, value: string | number | string[]): this;

    /**
     * Send a complete body as Buffer or string and close connection.
     * @param body Payload to send.
     */
    public sendAsync(body: Buffer | string): Promise<void>;

    /**
     * Stream a readable stream directly to the client.
     * @param stream Node.js Readable stream.
     */
    public streamAsync(stream: NodeJS.ReadableStream): Promise<void>;

    /**
     * End the response, invoking all onEnd callbacks.
     * @returns A promise that resolves when the response is fully sent.
     */
    public endAsync(): Promise<void>;
}

/**
 * Combined HTTP context providing request and response objects.
 */
export declare class HttpContext {
    /**
     * Parsed incoming request information.
     */
    public readonly request: Request;

    /**
     * Response builder for sending data.
     */
    public readonly response: Response;
}
```

### Exceptions

```typescript
/**
 * Base exception type for WebServer errors.
 */
export declare class WebServerException extends SystemException {
    /**
     * Create a WebServerException for general errors.
     * @param message Error details.
     * @param options Standard ErrorOptions.
     */
    public constructor(message?: string, options?: ErrorOptions);
}

/**
 * Thrown after a response has already been sent.
 */
export declare class ResponseSentException extends WebServerException {
    /**
     * Create a ResponseSentException when attempting additional operations after send.
     * @param message Error details.
     * @param options Standard ErrorOptions.
     */
    public constructor(message?: string, options?: ErrorOptions);
}

/**
 * Thrown when the HTTP context pool is exhausted or invalid.
 */
export declare class HttpContextPoolException extends WebServerException {
    /**
     * Create an exception for context pooling failures.
     * @param message Error details.
     * @param options Standard ErrorOptions.
     */
    public constructor(message?: string, options?: ErrorOptions);
}

/**
 * Generic middleware error during request processing.
 */
export declare class MiddlewareException extends WebServerException {
    /**
     * Create a MiddlewareException for errors in middleware logic.
     * @param message Error details.
     * @param options Standard ErrorOptions.
     */
    public constructor(message?: string, options?: ErrorOptions);
}

/**
 * Thrown when attempting to register middleware with a duplicate name.
 */
export declare class MiddlewareExistsException extends WebServerException {
    /**
     * Create an exception indicating the middleware name conflict.
     * @param name Name of the middleware that already exists.
     * @param options Standard ErrorOptions.
     */
    public constructor(name: string, options?: ErrorOptions);
}

/**
 * Thrown when an SSL certificate key is missing or invalid.
 */
export declare class InvalidCertificateKeyException extends WebServerException {
    /**
     * Create an exception for missing or invalid SSL key.
     * @param name Identifier for the certificate entry.
     */
    public constructor(name: string);
}

/**
 * Thrown when an SSL certificate chain is missing or invalid.
 */
export declare class InvalidCertificateException extends WebServerException {
    /**
     * Create an exception for missing or invalid SSL certificate.
     * @param name Identifier for the certificate entry.
     */
    public constructor(name: string);
}
```

## Events

The server emits runtime events via the `onEvent` callback:

- **`info`** — general progress messages  
- **`warning`** — recoverable issues (e.g. idle socket timeout)  
- **`error`** — fatal or unexpected errors  