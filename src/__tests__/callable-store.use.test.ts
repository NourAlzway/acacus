/**
 * @jest-environment node
 */

import { createCallableStore } from '../core/callable-store';
import { createStoreInternal } from '../core/store-internal';
import { createAction } from '../core/action-handler';

jest.mock('react', () => ({
  useSyncExternalStore: jest.fn((subscribe, getSnapshot) => {
    return getSnapshot();
  }),
}));

describe('callable-store - get/use pattern', () => {
  it('should provide get method for state access', () => {
    // Arrange
    const initialState = { count: 0, name: 'test' };
    const store = createStoreInternal(initialState);
    const callableStore = createCallableStore(store);

    // Act
    const fullState = callableStore.get(state => state);
    const count = callableStore.get(state => state.count);

    // Assert
    expect(fullState).toEqual(initialState);
    expect(count).toBe(0);
  });

  it('should access current state through get method', () => {
    // Arrange
    const initialState = { count: 0 };
    const store = createStoreInternal(initialState);
    const callableStore = createCallableStore(store);

    // Act
    store.setState({ count: 10 });

    const count = callableStore.get(state => state.count);

    // Assert
    expect(count).toBe(10);
  });

  it('should provide use method for action access', () => {
    // Arrange
    const initialState = { count: 0 };
    const store = createStoreInternal(initialState);
    const incrementAction = createAction(
      store,
      'increment',
      (state: typeof initialState) => ({
        count: state.count + 1,
      })
    );

    store.actions.increment = incrementAction;

    const callableStore = createCallableStore<
      typeof initialState,
      { increment: () => void }
    >(store);

    // Act
    const increment = callableStore.use(actions => actions.increment);
    const hasIncrement = callableStore.use(
      actions => typeof actions.increment === 'function'
    );

    // Assert
    expect(typeof increment).toBe('function');
    expect(hasIncrement).toBe(true);
  });

  it('should separate state and actions cleanly', () => {
    // Arrange
    const initialState = { count: 0, name: 'test' };
    const store = createStoreInternal(initialState);
    const incrementAction = createAction(
      store,
      'increment',
      (state: typeof initialState) => ({
        count: state.count + 1,
      })
    );

    store.actions.increment = incrementAction;

    const callableStore = createCallableStore<
      typeof initialState,
      { increment: () => void }
    >(store);

    // Act - get should only access state
    const stateData = callableStore.get(state => ({
      count: state.count,
      name: state.name,
    }));

    // Act - use should only access actions
    const increment = callableStore.use(actions => actions.increment);

    // Assert
    expect(stateData).toEqual({ count: 0, name: 'test' });
    expect(typeof increment).toBe('function');

    // Actions should work
    increment();
    const newCount = callableStore.get(state => state.count);
    expect(newCount).toBe(1);
  });

  it('should throw error for non-function selectors', () => {
    // Arrange
    const initialState = { count: 0 };
    const store = createStoreInternal(initialState);
    const callableStore = createCallableStore(store);

    // Assert
    expect(() => {
      // @ts-expect-error Testing runtime error
      callableStore.get('invalid');
    }).toThrow('State selector must be a function');

    expect(() => {
      // @ts-expect-error Testing runtime error
      callableStore.use('invalid');
    }).toThrow('Action selector must be a function');
  });
});
