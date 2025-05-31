# Object-Oriented by Design

ContextJS was built from the ground up with object-oriented programming (OOP) as a core principle—not an afterthought.

## Why OOP?

Many modern frameworks rely on function-based patterns and dynamic injection. ContextJS deliberately embraces:

- **Encapsulation**: Each service is a class with internal state and behavior
- **Inheritance**: Share logic through abstract base classes
- **Polymorphism**: Swap implementations via interfaces
- **Constructor Injection**: All dependencies are passed through constructors, not globals

```ts
export abstract class Logger {
  abstract log(message: string): void;
}

export class ConsoleLogger extends Logger {
  log(message: string) {
    console.log(`[log]: ${message}`);
  }
}
```

## Benefits

- **Predictability**: Class behavior is easy to reason about
- **Testability**: Mocks and fakes can be injected cleanly
- **Maintainability**: Code adheres to SOLID principles

## Ecosystem Alignment

Every ContextJS package:

- Exposes classes, not loose functions
- Encourages strong typing and inheritance
- Uses object-based APIs for clarity and control
