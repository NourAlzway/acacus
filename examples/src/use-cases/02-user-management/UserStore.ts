import { createStore } from 'acacus';
import { User, UserState } from './types';

const initialState: UserState = {
  users: [],
  selectedUserId: null,
  searchTerm: '',
  filter: 'all',
  counter: 0,
};

export const userStore = createStore(initialState)
  // User CRUD operations
  .action('addUser', (state, user: User) => ({
    users: [...state.users, user],
  }))
  .action('updateUser', (state, userId: number, updates: Partial<User>) => ({
    users: state.users.map(user =>
      user.id === userId ? { ...user, ...updates } : user
    ),
  }))
  .action('removeUser', (state, userId: number) => ({
    users: state.users.filter(user => user.id !== userId),
    selectedUserId:
      state.selectedUserId === userId ? null : state.selectedUserId,
  }))
  .action('toggleUserStatus', (state, userId: number) => ({
    users: state.users.map(user =>
      user.id === userId ? { ...user, active: !user.active } : user
    ),
  }))

  // Selection management
  .action('selectUser', (_, userId: number | null) => ({
    selectedUserId: userId,
  }))

  // Search and filtering
  .action('setSearchTerm', (_, term: string) => ({
    searchTerm: term,
  }))
  .action('setFilter', (_, filter: UserState['filter']) => ({
    filter,
  }))
  .action('clearSearch', () => ({
    searchTerm: '',
    filter: 'all' as const,
  }))
  .action('incrementCounter', state => ({
    counter: state.counter + 1,
  }))
  .build();
