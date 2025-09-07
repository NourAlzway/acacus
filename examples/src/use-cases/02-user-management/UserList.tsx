import { useMemo, useCallback, memo } from 'react';
import { userStore } from './UserStore';
import { User } from './types';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { UserCard } from '../../components/UserCard';

export const UserList = memo(() => {
  // State access
  const users = userStore.get(state => state.users);
  const searchTerm = userStore.get(state => state.searchTerm);
  const filter = userStore.get(state => state.filter);
  const selectedUserId = userStore.get(state => state.selectedUserId);

  // Action access
  const selectUser = userStore.use(actions => actions.selectUser);
  const updateUser = userStore.use(actions => actions.updateUser);
  const removeUser = userStore.use(actions => actions.removeUser);
  const toggleUserStatus = userStore.use(actions => actions.toggleUserStatus);

  // Filter users based on search and filter criteria
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && user.active) ||
        (filter === 'inactive' && !user.active);
      return matchesSearch && matchesFilter;
    });
  }, [users, searchTerm, filter]);

  const handleEditUser = useCallback(
    (user: User) => {
      const newName = prompt('Enter new name:', user.name);
      if (newName && newName !== user.name) {
        updateUser(user.id, { name: newName });
      }
    },
    [updateUser]
  );

  const handleSelectUser = useCallback(
    (userId: number) => {
      selectUser(userId);
    },
    [selectUser]
  );

  const handleToggleStatus = useCallback(
    (userId: number) => {
      toggleUserStatus(userId);
    },
    [toggleUserStatus]
  );

  const handleRemoveUser = useCallback(
    (userId: number) => {
      removeUser(userId);
    },
    [removeUser]
  );

  return (
    <Card title={`Users (${filteredUsers.length})`}>
      {filteredUsers.length === 0 ? (
        <EmptyState
          title="No users found"
          description={
            searchTerm || filter !== 'all'
              ? 'Try adjusting your search or filter.'
              : 'Add some users to get started.'
          }
        />
      ) : (
        <div className={'userListContainer'}>
          {filteredUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              isSelected={selectedUserId === user.id}
              onSelect={handleSelectUser}
              onEdit={handleEditUser}
              onToggleStatus={handleToggleStatus}
              onRemove={handleRemoveUser}
            />
          ))}
        </div>
      )}
    </Card>
  );
});
