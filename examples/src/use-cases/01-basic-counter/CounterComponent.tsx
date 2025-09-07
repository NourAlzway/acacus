import { counterStore } from './CounterStore';

export function CounterComponent() {
  // Action access using use(), which will not cause re-renders
  const increment = counterStore.use(actions => actions.increment);
  const decrement = counterStore.use(actions => actions.decrement);
  const reset = counterStore.use(actions => actions.reset);

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '10px' }}>
      <CounterStateComponent />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => increment()}>+1</button>
        <button onClick={() => increment(5)}>+5</button>
        <button onClick={() => decrement()}>-1</button>
        <button onClick={() => decrement(3)}>-3</button>
        <button onClick={() => reset()}>Reset</button>
      </div>
    </div>
  );
}

/*
 Here we separate the state access into its own component to demonstrate the performance benefits
 of using the get/use pattern. This component will only re-render when the specific state it accesses changes.
*/
const CounterStateComponent = () => {
  // State access using get()
  const count = counterStore.get(state => state.count);

  return <p>Count: {count}</p>;
};
