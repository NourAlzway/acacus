import { createStore } from '../index';

interface TestState {
  items: string[];
  selectedItem: string | null;
}

const initialState: TestState = {
  items: [],
  selectedItem: null,
};

describe('CallableStore - getAsyncStatus', () => {
  let store: ReturnType<typeof createTestStore>;

  const createTestStore = () =>
    createStore(initialState)
      .action('setItems', (_state, items: string[]) => ({ items }))
      .asyncAction('fetchItems', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return ['item1', 'item2', 'item3'];
      })
      .asyncAction('createItem', async (_state, name: string) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return { id: 1, name };
      })
      .asyncAction('deleteItem', async (_state, id: number) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return id;
      })
      .build();

  beforeEach(() => {
    store = createTestStore();
  });

  describe('Initial state', () => {
    it('should return default async state structure for all async actions', () => {
      // Arrange & Act
      const fetchItemsStatus = store.getAsyncStatus('fetchItems');
      const createItemStatus = store.getAsyncStatus('createItem');
      const deleteItemStatus = store.getAsyncStatus('deleteItem');

      // Assert
      expect(fetchItemsStatus).toEqual({
        loading: false,
        error: null,
        data: null,
      });

      expect(createItemStatus).toEqual({
        loading: false,
        error: null,
        data: null,
      });

      expect(deleteItemStatus).toEqual({
        loading: false,
        error: null,
        data: null,
      });
    });
  });

  describe('Loading state', () => {
    it('should show loading state when async action is in progress', async () => {
      // Arrange & Act
      // Start async action
      const promise = store.use(actions => actions.fetchItems)();

      // Assert
      // Should show loading immediately
      const statusDuringLoading = store.getAsyncStatus('fetchItems');
      expect(statusDuringLoading.loading).toBe(true);
      expect(statusDuringLoading.error).toBe(null);
      expect(statusDuringLoading.data).toBe(null);

      // Wait for completion
      await promise;
    });
  });

  describe('Success state', () => {
    it('should show success state when async action completes successfully', async () => {
      // Arrange
      const fetchAction = store.use(actions => actions.fetchItems);

      // Act
      await fetchAction();

      const status = store.getAsyncStatus('fetchItems');

      // Assert
      expect(status.loading).toBe(false);
      expect(status.error).toBe(null);
      expect(status.data).toEqual(['item1', 'item2', 'item3']);
    });

    it('should handle different return types correctly', async () => {
      // Arrange
      const createAction = store.use(actions => actions.createItem);

      // Act
      await createAction('test-item');

      // Assert
      const status = store.getAsyncStatus('createItem');
      expect(status.loading).toBe(false);
      expect(status.error).toBe(null);
      expect(status.data).toEqual({ id: 1, name: 'test-item' });
    });
  });

  describe('Error state', () => {
    it('should show error state when async action fails', async () => {
      // Arrange
      const failingStore = createStore(initialState)
        .asyncAction('failingAction', async () => {
          throw new Error('Test error');
        })
        .build();

      const failingAction = failingStore.use(actions => actions.failingAction);

      // Act
      try {
        await failingAction();
      } catch {
        // Expected to throw
      }

      // Assert
      const status = failingStore.getAsyncStatus('failingAction');
      expect(status.loading).toBe(false);
      expect(status.error).toBeInstanceOf(Error);
      expect(status.error?.message).toBe('Test error');
      expect(status.data).toBe(null);
    });
  });

  describe('Type safety', () => {
    it('should enforce correct async action names at compile time', () => {
      // Arrange & Act
      // These should compile without errors
      const fetchStatus = store.getAsyncStatus('fetchItems');
      const createStatus = store.getAsyncStatus('createItem');
      const deleteStatus = store.getAsyncStatus('deleteItem');

      // Assert
      // Verify the types are correct
      expect(typeof fetchStatus.loading).toBe('boolean');
      expect(typeof createStatus.loading).toBe('boolean');
      expect(typeof deleteStatus.loading).toBe('boolean');

      // store.getAsyncStatus('setItems');

      // store.getAsyncStatus('invalidAction');
    });
  });

  describe('Multiple async actions', () => {
    it('should track independent states for different async actions', async () => {
      // Arrange
      const fetchAction = store.use(actions => actions.fetchItems);
      const createAction = store.use(actions => actions.createItem);

      // Act
      // Start fetchItems
      const fetchPromise = fetchAction();

      // fetchItems should be loading, createItem should not
      let fetchStatus = store.getAsyncStatus('fetchItems');
      let createStatus = store.getAsyncStatus('createItem');

      expect(fetchStatus.loading).toBe(true);
      expect(createStatus.loading).toBe(false);

      // Wait for fetchItems to complete
      await fetchPromise;

      // Now start createItem
      const createPromise = createAction('new-item');

      // fetchItems should be done, createItem should be loading
      fetchStatus = store.getAsyncStatus('fetchItems');
      createStatus = store.getAsyncStatus('createItem');

      // Assert
      expect(fetchStatus.loading).toBe(false);
      expect(fetchStatus.data).toEqual(['item1', 'item2', 'item3']);
      expect(createStatus.loading).toBe(true);

      // Wait for createItem to complete
      await createPromise;

      // Both should be done now
      fetchStatus = store.getAsyncStatus('fetchItems');
      createStatus = store.getAsyncStatus('createItem');

      expect(fetchStatus.loading).toBe(false);
      expect(fetchStatus.data).toEqual(['item1', 'item2', 'item3']);
      expect(createStatus.loading).toBe(false);
      expect(createStatus.data).toEqual({ id: 1, name: 'new-item' });
    });
  });

  describe('Comparison with old API pattern', () => {
    it('should provide the same data as the old (state as any).actionName pattern', async () => {
      // Arrange
      const fetchAction = store.use(actions => actions.fetchItems);
      // Act
      // Before action
      const newApiInitial = store.getAsyncStatus('fetchItems');
      const oldApiInitial = store.get(state => (state as any).fetchItems) || {
        loading: false,
        error: null,
        data: null,
      };

      // Assert
      expect(newApiInitial).toEqual(oldApiInitial);

      // Start action
      const promise = fetchAction();

      // During loading
      const newApiLoading = store.getAsyncStatus('fetchItems');
      const oldApiLoading = store.get(state => (state as any).fetchItems) || {
        loading: false,
        error: null,
        data: null,
      };

      expect(newApiLoading).toEqual(oldApiLoading);

      // After completion
      await promise;

      const newApiComplete = store.getAsyncStatus('fetchItems');
      const oldApiComplete = store.get(state => (state as any).fetchItems) || {
        loading: false,
        error: null,
        data: null,
      };

      expect(newApiComplete).toEqual(oldApiComplete);
    });
  });
});
