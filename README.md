# mst-use-observable

A way to use [MobX-State-Tree](https://mobx-state-tree.js.org/intro/welcome) without `observer` Higher Order Components. This hook makes MST compatible with the [React Compiler](https://react.dev/learn/react-compiler).

[Video introduction](https://www.youtube.com/watch?v=NsFD-1HkJNU)

[Original demo repo with Remix](https://github.com/coolsoftwaretyler/react-compiler-demo-with-mobx-state-tree)

## Installation

```sh
npm install mst-use-observable
```

## Usage

```tsx
import { t } from "mobx-state-tree";
import { useObservable } from "mst-use-observable";

const RootStoreModel = t
  .model("RootStoreModel", {
    count: t.number,
  })
  .actions((self) => ({
    increment() {
      self.count += 1;
    },
    decrement() {
      self.count -= 1;
    },
  }));

const store = RootStoreModel.create({ count: 0 });

export default function App() {
  const { count } = useObservable(store);

  return (
    <div className="App">
      <p>{count}</p>
      <button onClick={store.increment}>+</button>
      <button onClick={store.decrement}>-</button>
    </div>
  );
}
```
