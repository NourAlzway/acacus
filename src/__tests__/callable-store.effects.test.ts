/**
 * @jest-environment node
 */

import { createCallableStore } from '../core/callable-store';
import { createStoreInternal } from '../core/store-internal';

jest.mock('react', () => ({
  useSyncExternalStore: jest.fn((subscribe, getSnapshot) => {
    return getSnapshot();
  }),
}));

describe('callable-store - working with effects', () => {
  it('should make bound effects available', () => {
    // Arrange
    const initialState = { message: 'initial', count: 0 };
    const store = createStoreInternal(initialState);

    // Act
    store.effects.updateMessage = (
      state,
      helpers,
      ...args: unknown[]
    ): void => {
      const [newMessage] = args as [string];
      helpers.set({ message: newMessage });
    };

    store.effects.increment = (state, helpers): void => {
      helpers.set({ count: state.count + 1 });
    };

    const callableStore = createCallableStore(store);

    // Assert - effects should be available through use method
    const updateMessage = callableStore.use(
      actions => (actions as any).updateMessage
    );
    const increment = callableStore.use(actions => (actions as any).increment);

    expect(typeof updateMessage).toBe('function');
    expect(typeof increment).toBe('function');
  });

  it('should execute bound effects', () => {
    // Arrange
    const initialState = { message: 'initial' };
    const store = createStoreInternal(initialState);

    // Act
    store.effects.setMessage = (_state, helpers, ...args: unknown[]): void => {
      const [newMessage] = args as [string];
      helpers.set({ message: newMessage });
    };

    const callableStore = createCallableStore(store);

    const setMessage = callableStore.use(
      actions => (actions as any).setMessage
    );
    setMessage('updated');

    // Assert
    const state = callableStore.get(s => s);
    expect(state.message).toBe('updated');
  });
});
