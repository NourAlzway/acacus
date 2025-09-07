import { useSyncExternalStoreWithSelector } from './use-sync-external-store-with-selector';
// Import selector-aware hook without adding runtime dep by reusing React 18 API via fallback
// Note: React exports useSyncExternalStoreWithSelector from 'use-sync-external-store/shim/with-selector' for non-React envs,
// but in library context we'll implement a minimal inline selector handling to avoid an extra dependency.
import {
  CallableStore,
  StoreInternal,
  ValidStateType,
  isFunction,
  StateSelector,
  ActionSelector,
  AsyncActionKeys,
  GetAsyncStatusResult,
  AsyncState,
} from '../types';

/**
 * Creates a callable store interface from an internal store implementation
 */
export function createCallableStore<T extends ValidStateType, Actions>(
  store: StoreInternal<T>
): CallableStore<T, Actions> {
  // Create actions object
  const createActions = (): Actions => {
    return store.actions as Actions;
  };

  // Create a callable store with new get/use pattern
  const callableStore = {
    // Get method for accessing state with React hooks integration
    get: <R>(stateSelector: StateSelector<T, R>): R => {
      if (!isFunction(stateSelector)) {
        throw new TypeError('State selector must be a function');
      }

      // Try to use React hooks for reactive subscriptions
      try {
        // Selector-aware subscription prevents re-renders when selected slice is equal
        const equality =
          (store.config.equalityFn as (a: R, b: R) => boolean) ?? Object.is;
        return useSyncExternalStoreWithSelector(
          store.subscribe,
          store.getState,
          store.getState,
          stateSelector,
          equality
        );
      } catch {
        // If hooks cannot be used (outside render), return a non-reactive snapshot
        const state = store.getState();
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn(
            '[Store Warning] store.get() could not use React hooks (likely called outside render). Returning a non-reactive snapshot.'
          );
        }
        return stateSelector(state);
      }
    },

    // Use method for accessing actions
    use: <R>(actionSelector: ActionSelector<Actions, R>): R => {
      if (!isFunction(actionSelector)) {
        throw new TypeError('Action selector must be a function');
      }
      const actions = createActions();
      return actionSelector(actions);
    },

    // Type-safe async status access
    getAsyncStatus: <K extends AsyncActionKeys<T>>(
      asyncActionName: K
    ): GetAsyncStatusResult<T, K> => {
      // Create a selector that extracts the async state
      const asyncStateSelector = (state: Readonly<T>) => {
        const asyncState = state[asyncActionName] as
          | AsyncState<any>
          | undefined;
        // Return default async state structure if undefined
        return asyncState || { loading: false, error: null, data: null };
      };

      // Try to use React hooks for reactive subscriptions
      try {
        const equality =
          (store.config.equalityFn as (
            a: AsyncState<any>,
            b: AsyncState<any>
          ) => boolean) ??
          ((a, b) =>
            a.loading === b.loading &&
            a.error === b.error &&
            a.data === b.data);

        return useSyncExternalStoreWithSelector(
          store.subscribe,
          store.getState,
          store.getState,
          asyncStateSelector,
          equality
        ) as GetAsyncStatusResult<T, K>;
      } catch {
        // If hooks cannot be used (outside render), return a non-reactive snapshot
        const state = store.getState();
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn(
            '[Store Warning] store.getAsyncStatus() could not use React hooks (likely called outside render). Returning a non-reactive snapshot.'
          );
        }
        return asyncStateSelector(state) as GetAsyncStatusResult<T, K>;
      }
    },

    // Keep subscription for direct subscriptions
    subscribe: store.subscribe,
    getState: store.getState,

    // Add remaining StoreInternal properties for compatibility
    actions: store.actions,
    config: store.config,
  };

  return callableStore as CallableStore<T, Actions>;
}
