// User data structure
export interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

// Application state structure
export interface UserState {
  users: User[];
  selectedUserId: number | null;
  searchTerm: string;
  filter: 'all' | 'active' | 'inactive';
  counter: number;
}
