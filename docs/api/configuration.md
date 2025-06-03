# @contextjs/configuration

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)&nbsp;
[![npm](https://badgen.net/npm/v/@contextjs/configuration?cache=300)](https://www.npmjs.com/package/@contextjs/configuration)&nbsp;
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)&nbsp;

> Lightweight configuration system for ContextJS applications, featuring async providers and environment variable support.

## Features

- Fluent API for configuring providers
- Async-based configuration loading
- Support for environment variables
- Pluggable provider model
- Seamless integration with `Application` via `.useConfiguration()`

## Installation

```bash
npm i @contextjs/configuration
```

## Quick Start

```typescript
import { Application } from "@contextjs/system";
import "@contextjs/configuration";

const app = new Application();

app.useConfiguration(options => {
    options.useEnvironmentVariables();
    options.useProvider({
        async getValueAsync(key) {
            if (key === "App:Port")
                return 3000;
            return null;
        }
    });
});

const port = await app.configuration.getValueAsync("App:Port");
```

## API Reference

```typescript
/**
 * Class representing options for configuring the application's settings.
 */
export declare class ConfigurationOptions {
    /**
     * The configuration object for the application.
     * @type {Configuration}
     */
    public readonly configuration: Configuration;

    /**
     * Adds a custom configuration provider to the configuration.
     * 
     * @param {IConfigurationProvider} provider - The configuration provider to add.
     * @returns {ConfigurationOptions} - The current instance of ConfigurationOptions.
     */
    public useProvider(provider: IConfigurationProvider): ConfigurationOptions;

    /**
     * Enables the use of environment variables in the configuration.
     * 
     * @returns {ConfigurationOptions} - The current instance of ConfigurationOptions.
     */
    public useEnvironmentVariables(): ConfigurationOptions;
}

/**
 * Class representing the configuration for the application.
 * It manages configuration providers and retrieves configuration values.
 */
export declare class Configuration {
    /**
     * The application associated with this configuration.
     * @type {Application}
     */
    public readonly application: Application;

    /**
     * An array of configuration providers used to retrieve configuration values.
     * @type {IConfigurationProvider[]}
     */
    public readonly providers: IConfigurationProvider[];

    /**
     * Indicates whether environment variables should be used in the configuration.
     * @type {boolean}
     */
    public useEnvironmentVariables: boolean;

    /**
     * Retrieves a configuration value based on the provided key.
     * 
     * @param {string} key - The key used to look up the configuration value.
     * @returns {Promise<any>} - A promise that resolves to the configuration value if found, otherwise null.
     */
    public getValueAsync(key: string): Promise<any>;
}

/**
 * Module declaration for "@contextjs/system".
 */
declare module "@contextjs/system" {
    /**
     * Interface for extending the Application.
     */
    export interface Application {
        /**
         * The configuration object for the application.
         * @type {Configuration}
         */
        configuration: Configuration;

        /**
         * Configures the application using the provided configuration options.
         * 
         * @param {(configurationOptions: ConfigurationOptions) => void} options - A callback function to configure the application.
         * @returns {Application} - The current application instance.
         * @throws {NullReferenceException} - If the options parameter is null or undefined.
         */
        useConfiguration(options: (configurationOptions: ConfigurationOptions) => void): Application;
    }
}

/**
 * Interface representing a configuration provider.
 * A configuration provider retrieves configuration values based on keys.
 */
export declare interface IConfigurationProvider {
    /**
     * Retrieves a configuration value based on the provided key.
     * 
     * @param {string} key - The key used to look up the configuration value.
     * @returns {Promise<any>} - A promise that resolves to the configuration value if found, otherwise null.
     */
    getValueAsync(key: string): Promise<any>;
}
```

## Testing

All features are covered by 100% unit test coverage, ensuring reliability, correctness, and long-term maintainability - so you can focus on building, not debugging.