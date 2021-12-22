Fun*ctional* <sup>Typescript</sup>
===

*Well typed constructs for functional style programming.*


`Pipe`
---

Pass values through operations/tasks and guard against errors in a chain-like style without `try..catch` blocks or variable declarations (`let`).

```typescript
function pipe<Current>(data?: Current): Pipe<Current>;
```

`Current` is the type of the value being passed at a point in the chain (in the previous case, the start).

```typescript
interface Pipe<Current> { ... }
```

### Members:

- #### `.guard()` Adds a guarding level with the type of possible errors thrown within.

  This method is analogous to announcing that there will be a **new** `try..catch` block without actually creating it yet, but only declaring error types that belong in the `catch` statements.

  For this chained approach, some things call for a different order than the usual.

  Multiple continuous chains for this method is equivalent to calling it once with an [union type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types), while calling it at different points in the chain is analogous to a **new nested** `try..catch` block.

  ```typescript
  function guard<Error>(): Pipe<Current>;
  ```

- #### `.try(task)` Executes a task while wrapped in a `try..catch` block.

  This method is analogous to opening the `try` block (or continue within if it is already open). `task` is the (or therefore, part of the) statements enclosed within.

  ```typescript
  function try(task: (data: Current) => void): Pipe<Current>;
  function try<Next>(task: (data: Current) => Next): Pipe<Next>;
  ```

  If `task` returns a value, the type `Next` becomes the new `Current`. Otherwise, the last value is passed down the chain, maintaining `Current`.

- #### `.do(task)` Executes a task without any error handling.

  Use in place of `try` if sure the task will not throw. If it throws, the error will be thrown out of the pipe as if there were no `catch` blocks for it.

  ```typescript
  function do(task: (data: Current) => void): Pipe<Current>;
  function do<Next>(task: (data: Current) => Next): Pipe<Next>;
  ```

- #### `.catch(handler, level?)` Provides a handler for errors caught in any `try` up to the top or the number of guarded levels when indicated.

  The handler executes only when an accounted (indicated by `level`) `try` throws an error. If the handler returns a value, the chain is **recovered** with that value, otherwise, the chain is halted.

  If there are no `catch` calls, the pipe may halt at any point silently.

  ```typescript
  function catch(handler: (error: Error, lastData?: Previous) => void | Current, level?: number): Pipe<Current>;
  ```

  If `level` is not provided, the handler takes into account all the `try`s in the chain. Otherwise, it must be a value between `0` and the total number of guarded levels (`guard`s followed by `try`s)

  `Error` type is the union type of `guard`s from all accounted levels.

  `Previous` type is the union type for all the previous `Current` types throughout the chain from all accounted levels.

### Usage:

```typescript
pipe()
  .guard<'W'>()
  .try(() => { /* may throw 'W', returns 'a' */ })
  .guard<'X'>()
  .try(() => { /* may throw 'X', returns 'b' */ })
  .guard<'Y'>()
  .try(() => { /* may throw 'Y', returns 'c' */ })
  .guard<'Z'>()
  .try(() => { /* may throw 'Z', returns 'd' */ })
  .try(() => { /* may throw 'Z', returns 'e' */ })
  .catch((thrown, saved) => {
  // thrown: 'Z'
  // saved: 'c' | 'd'
  }, 0) // current level
  .catch((thrown, saved) => {
  // thrown: 'X' | 'Y'
  // saved: 'a' | 'b'
  }, 1) // one level above
  .catch((thrown) => {
  // thrown: 'W'
  }); // all levels
```
