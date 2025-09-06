/**
 * @jest-environment node
 */

import { createStore, deepEqual, deepClone } from '../index';

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

describe('index - main exports', () => {
  it('should export createStore function that builds working stores', () => {
    // Arrange & Act
    const store = createStore({ count: 0 }).build();

    // Assert
    expect(typeof createStore).toBe('function');
    expect(typeof store).toBe('object');
    expect(typeof store.get).toBe('function');
    expect(typeof store.use).toBe('function');
  });

  it('should export utility functions', () => {
    // Arrange & Act & Assert
    expect(typeof deepEqual).toBe('function');
    expect(typeof deepClone).toBe('function');
  });

  it('should create functional store with actions through builder API', () => {
    // Arrange
    const initialState = { count: 0, message: 'hello' };
    const store = createStore(initialState)
      .action('increment', state => ({ count: state.count + 1 }))
      .action('setMessage', (_state, message: string) => ({ message }))
      .build();

    // Act
    const increment = store.use(actions => actions.increment);
    const setMessage = store.use(actions => actions.setMessage);
    increment();
    setMessage('world');

    // Assert
    const finalState = store.get(s => s);
    expect(finalState.count).toBe(1);
    expect(finalState.message).toBe('world');
  });

  it('should support state subscriptions for side effects', () => {
    // Arrange
    const initialState = { count: 0, logs: [] as string[] };
    const logEntries: string[] = [];

    const store = createStore(initialState)
      .action('increment', state => ({ count: state.count + 1 }))
      .action('addLog', (state, message: string) => ({
        logs: [...state.logs, message],
      }))
      .build();

    // Subscribe to log count changes
    store.subscribe((state, prevState) => {
      if (state.count !== prevState.count) {
        logEntries.push(
          `Count changed from ${prevState.count} to ${state.count}`
        );
      }
    });

    // Act
    const increment = store.use(actions => actions.increment);
    increment();
    increment();

    // Assert
    expect(store.get(s => s.count)).toBe(2);
    expect(logEntries).toEqual([
      'Count changed from 0 to 1',
      'Count changed from 1 to 2',
    ]);
  });
});
