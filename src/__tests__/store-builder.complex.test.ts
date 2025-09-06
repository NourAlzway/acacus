/**
 * @jest-environment node
 */

import { StoreBuilderImpl } from '../core/store-builder';

// eslint-disable-next-line no-console
const originalConsoleWarn = console.warn;
// eslint-disable-next-line no-console
const originalConsoleError = console.error;

beforeAll(() => {
  // eslint-disable-next-line no-console
  console.warn = jest.fn();
  // eslint-disable-next-line no-console
  console.error = jest.fn();
});

afterAll(() => {
  // eslint-disable-next-line no-console
  console.warn = originalConsoleWarn;
  // eslint-disable-next-line no-console
  console.error = originalConsoleError;
});

describe('store-builder - complex scenarios', () => {
  it('should handle complex chaining with all features', async () => {
    // Arrange
    const initialState = {
      users: [] as { id: number; name: string }[],
      count: 0,
      loading: false,
      initialized: false,
    };

    // Act
    const store = new StoreBuilderImpl(initialState)
      .action(
        'addUser',
        (state: typeof initialState, user: { id: number; name: string }) => ({
          users: [...state.users, user],
          count: state.count + 1,
        })
      )
      .action('clearUsers', () => ({
        users: [],
        count: 0,
      }))
      .asyncAction(
        'fetchUsers',
        async (): Promise<{ id: number; name: string }[]> => {
          return [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
          ];
        }
      )
      .build();

    // Assert
    const initializedState = store.get(s => ({ initialized: s.initialized }));
    expect(initializedState.initialized).toBe(false);

    const addUser = store.use(actions => actions.addUser);
    const clearUsers = store.use(actions => actions.clearUsers);
    const fetchUsers = store.use(actions => actions.fetchUsers);
    addUser({ id: 1, name: 'Test User' });

    const userState = store.get(s => ({ users: s.users, count: s.count }));
    expect(userState.users).toHaveLength(1);
    expect(userState.count).toBe(1);

    await fetchUsers();

    clearUsers();

    const clearedState = store.get(s => ({ users: s.users, count: s.count }));
    expect(clearedState.users).toHaveLength(0);
    expect(clearedState.count).toBe(0);

    const finalState = store.get(s => ({
      users: s.users,
      count: s.count,
      loading: s.loading,
      initialized: s.initialized,
    }));
    expect(finalState).toHaveProperty('users');
    expect(finalState).toHaveProperty('count');
    expect(finalState).toHaveProperty('loading');
    expect(finalState).toHaveProperty('initialized');
    expect(typeof addUser).toBe('function');
    expect(typeof clearUsers).toBe('function');
    expect(typeof fetchUsers).toBe('function');
  });
});
