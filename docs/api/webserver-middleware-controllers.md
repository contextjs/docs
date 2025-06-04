# @contextjs/webserver-middleware-controllers

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)&nbsp;
[![npm](https://badgen.net/npm/v/@contextjs/webserver-middleware-controllers?cache=300)](https://www.npmjs.com/package/@contextjs/webserver-middleware-controllers)&nbsp;
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

Controllers middleware for the ContextJS webserver.

## Installation

```bash
npm i @contextjs/webserver-middleware-controllers
```

## Overview

This package provides attribute-based routing support for the ContextJS webserver. It introduces a controller and verb decorator model, allowing you to build organized, testable route handlers similar to established MVC patterns.

## Features

- Attribute-based route mapping using `@Controller`, `@Get`, `@Post`, `@Put`, and `@Delete`
- Auto-discovery of compiled `.js` or `.mjs` controllers
- Customizable default controller and action fallbacks
- Integration via `.useControllers()` on `WebServerOptions`

## Usage

```typescript
import "@contextjs/di";
import "@contextjs/webserver";
import "@contextjs/webserver-middleware-controllers";

import { Application } from "@contextjs/system";
import { WebServerOptions } from "@contextjs/webserver";
import { Controller, Get } from "@contextjs/webserver-middleware-controllers";

interface ILoggerService {
    log(message: string): void;
}

class LoggerService implements ILoggerService {
    log(message: string): void {
        console.log(message);
    }
}

@Controller()
class HomeController {
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

const application = new Application();

application.useDependencyInjection();

application.services.addTransient<ILoggerService, LoggerService>();

application.useWebServer((options: WebServerOptions) => {
    options.onEvent = (event) => console.log(event.type, event.detail);
    options.useControllers();
});

await application.runAsync();
```

Requests to `/home/index` will be routed to the `index()` method of `HomeController`.

## Configuration

You can optionally customize the default controller and action name:

```typescript
application.useWebServer((options: WebServerOptions) => {
    options.onEvent = (event) => console.log(event.type, event.detail);
    options.useControllers(controllerOptions => {
        controllerOptions.defaultController = "about";
        controllerOptions.defaultAction = "index";
    });
});
```

## Controller Auto-Discovery

Controllers are discovered automatically from the `outDir` specified in your `tsconfig.json`. You must compile your controllers to `.js` or `.mjs` files.

## API Reference

```typescript
/**
 * Defines the Controller decorator, which is used to mark a class as a controller.
 * The optional template parameter specifies the base route for the controller.
 * @param template - The base route for the controller.
 * @return A class decorator that marks the class as a controller.
 */
export declare function Controller(template?: string): ClassDecorator;

/**
 * Defines the Get decorator for methods in a controller.
 * This decorator marks a method to handle HTTP GET requests.
 * The template parameter specifies the route for the method.
 * @param template - The route for the method.
 * @return A method decorator that marks the method to handle GET requests.
 */
export declare function Get(template: string): MethodDecorator;

/**
 * Defines the Post decorator for methods in a controller.
 * This decorator marks a method to handle HTTP POST requests.
 * The template parameter specifies the route for the method.
 * @param template - The route for the method.
 * @return A method decorator that marks the method to handle POST requests.
 */
export declare function Post(template: string): MethodDecorator;

/**
 * Defines the Put decorator for methods in a controller.
 * This decorator marks a method to handle HTTP PUT requests.
 * The template parameter specifies the route for the method.
 * @param template - The route for the method.
 * @return A method decorator that marks the method to handle PUT requests.
 */
export declare function Put(template: string): MethodDecorator;

/**
 * Defines the Delete decorator for methods in a controller.
 * This decorator marks a method to handle HTTP DELETE requests.
 * The template parameter specifies the route for the method.
 * @param template - The route for the method.
 * @return A method decorator that marks the method to handle DELETE requests.
 */
export declare function Delete(template: string): MethodDecorator;

/**
 * Extends the WebServerOptions interface with a method to configure controllers.
 */
declare module "@contextjs/webserver" {
    export interface WebServerOptions {
        useControllers(configure?: (controllersOptions: ControllerOptions) => void): WebServerOptions;
    }
}

/**
 * Defines the ControllerOptions class, which is used to configure default controller and action names.
 */
export declare class ControllerOptions {
    /**
     * The default controller name.
     */
    public defaultController: string;

    /**
     * The default action name.
     */
    public defaultAction: string;
}

/**
 * Defines the VerbRouteInfo class, which extends RouteInfo to include an HTTP verb.
 */
export declare class VerbRouteInfo extends RouteInfo {

    /**
     * The HTTP verb for the route.
     */
    public readonly verb: HttpVerb;

    /**
     * Creates an instance of VerbRouteInfo.
     * @param verb - The HTTP verb for the route.
     * @param template - The route template.
     */
    constructor(verb: HttpVerb, template: string);
}

/**
 * Defines the ControllerDefinition class, which represents a controller with its name, class reference, and optional route.
 */
export declare class ControllerDefinition {

    /**
     * The name of the controller.
     */
    public readonly name: string;

    /**
     * The class reference for the controller.
     */
    public readonly classReference: Function;

    /**
     * An optional RouteInfo object representing the route for the controller.
     */
    public readonly route?: RouteInfo;

    /**
     * Creates an instance of ControllerDefinition.
     * @param name - The name of the controller.
     * @param classReference - The class reference for the controller.
     * @param route - An optional RouteInfo object representing the route for the controller.
     */
    constructor(name: string, classReference: Function, route?: RouteInfo);
}

/**
 * Represents an action result that can execute and write to the HTTP context.
 */
export declare interface IActionResult {
    /**
     * Executes the result, writing to the given HTTP context.
     * @param httpContext - The HTTP context.
     */
    executeAsync(httpContext: HttpContext): Promise<any>;
}

/**
 * Returns a result indicating a successful response with status 200 ("OK") and an optional string value as the response body.
 * @param value - The response body as a string.
 */
export declare function OK(value?: string): IActionResult;

/**
 * Returns a result that serializes the given value as JSON and responds with status 200 ("OK").
 * @param value - The value to serialize as JSON.
 */
export declare function Json(value: any): IActionResult;

/**
 * Returns a result indicating a successful response with status 204 ("No Content").
 */
export declare function NoContent(): IActionResult;

/**
 * Returns a result indicating a successful response with no body and no modification to status code.
 */
export declare function Empty(): IActionResult;

/**
 * Returns a result indicating a response with status 400 ("Bad Request") and an optional message as the response body.
 * @param message - The optional error message.
 */
export declare function BadRequest(message?: string): IActionResult;

/**
 * Returns a result indicating a response with status 401 ("Unauthorized").
 */
export declare function Unauthorized(): IActionResult;

/**
 * Returns a result indicating a response with status 403 ("Forbidden").
 */
export declare function Forbidden(): IActionResult;

/**
 * Returns a result indicating a response with status 404 ("Not Found").
 */
export declare function NotFound(): IActionResult;

/**
 * Returns a result indicating a response with status 201 ("Created"), an optional value as the response body, and an optional "Location" header.
 * @param value - The response body as a string.
 * @param location - The optional Location header value.
 */
export declare function Created(value?: string, location?: string): IActionResult;

/**
 * Returns a result with custom content, content-type, status code, and reason phrase.
 * @param content - The content to write to the response.
 * @param contentType - The content-type header value.
 * @param statusCode - The HTTP status code.
 * @param statusMessage - The HTTP reason phrase.
 */
export declare function Content(content: string, contentType?: string, statusCode?: number, statusMessage?: string): IActionResult;
```