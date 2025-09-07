import { createStore } from 'acacus';

// Define the state interface
interface CounterState {
  count: number;
}

// Create the counter store with initial state
export const counterStore = createStore<CounterState>({
  count: 0,
})
  // Add synchronous actions
  .action('increment', (state, amount: number = 1) => ({
    count: state.count + amount,
  }))
  .action('decrement', (state, amount: number = 1) => ({
    count: state.count - amount,
  }))
  .action('reset', () => ({
    count: 0,
  }))
  // Build the store
  .build();
