import { StoreBuilder, StoreConfig, ValidStateType } from './types';
import { StoreBuilderImpl } from './core/store-builder';

/**
 * Creates a new store with a fluent configuration API
 *
 * This library uses a get/use pattern that provides clean and simple state management:
 * - Access state with `store.get(state => state.property)`
 * - Access actions with `store.use(actions => actions.actionName)`
 * - Built-in support for async operations and error handling
 * - Subscribe to state changes with `store.subscribe()`
 *
 * @param initialState The starting state for the store
 * @param config Optional settings for error handling and debugging
 * @returns A store builder that allows chaining of actions
 *
 * @example
 * ```typescript
 * const counterStore = createStore({ count: 0 })
 *   .action('increment', (state, amount: number = 1) => ({
 *     count: state.count + amount
 *   }))
 *   .action('decrement', (state) => ({
 *     count: state.count - 1
 *   }))
 *   .build();
 *
 * // Usage in React components
 * const count = counterStore.get(state => state.count);
 * const increment = counterStore.use(actions => actions.increment);
 * ```
 *
 * **Key behaviors**:
 * - State updates merge properties at the top level only
 * - Use asyncAction to get automatic loading and error state management
 * - All errors are handled gracefully with optional custom error handlers
 */
export function createStore<T extends ValidStateType>(
  initialState: T,
  config?: StoreConfig
): StoreBuilder<T> {
  return new StoreBuilderImpl(initialState, config);
}
