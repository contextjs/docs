# @contextjs/io API Reference

This package provides file and directory utilities, exceptions, and path operations for ContextJS and Node.js applications.

# @contextjs/io

[![Tests](https://github.com/contextjs/context/actions/workflows/tests.yaml/badge.svg?branch=main)](https://github.com/contextjs/context/actions/workflows/tests.yaml)
[![npm](https://badgen.net/npm/v/@contextjs/io?cache=300)](https://www.npmjs.com/package/@contextjs/io)
[![License](https://badgen.net/static/license/MIT)](https://github.com/contextjs/context/blob/main/LICENSE)

> File system utilities for reading, writing, and inspecting files, directories, and paths — with clean APIs and exception-based error handling.

## ✨ Features

- Create, rename, and delete files and directories
- Automatic parent directory creation for files
- Path utilities: `isFile`, `isDirectory`, `exists`
- Clear and consistent exceptions
- Null-safe input validation
- Zero dependencies

## 📦 Installation

```bash

## Public API

> Represents an exception that occurs when a file already exists.

### Class: `FileExistsException`

```ts
export declare class FileExistsException extends Exception {
```
---

> Represents an exception that occurs when a file is not found.

### Class: `FileNotFoundException`

```ts
export declare class FileNotFoundException extends Exception {
```
---

> Represents an exception that occurs when a path is not found.

### Class: `PathNotFoundException`

```ts
export declare class PathNotFoundException extends Exception {
```
---

> Contains methods for working with directories.

### Class: `Directory`

```ts
export declare class Directory {
```
---

> Contains methods for working with files.

### Class: `File`

```ts
export declare class File {
```
---

> Contains methods for working with paths.

### Class: `Path`

```ts
export declare class Path {
```
---
