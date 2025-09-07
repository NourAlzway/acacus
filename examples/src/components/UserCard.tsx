import { memo, useCallback } from 'react';
import { UserAvatar } from './UserAvatar';
import { UserStatusBadge } from './UserStatusBadge';
import { Button } from './Button';
import { User } from '../use-cases/02-user-management/types';

interface UserCardProps {
  user: User;
  isSelected: boolean;
  onSelect: (userId: number) => void;
  onEdit: (user: User) => void;
  onToggleStatus: (userId: number) => void;
  onRemove: (userId: number) => void;
}

export const UserCard = memo(function UserCard({
  user,
  isSelected,
  onSelect,
  onEdit,
  onToggleStatus,
  onRemove,
}: UserCardProps) {
  const handleSelect = useCallback(() => {
    onSelect(user.id);
  }, [user.id, onSelect]);

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onEdit(user);
    },
    [user, onEdit]
  );

  const handleToggleStatus = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleStatus(user.id);
    },
    [user.id, onToggleStatus]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (confirm(`Remove ${user.name}?`)) {
        onRemove(user.id);
      }
    },
    [user.id, user.name, onRemove]
  );

  return (
    <div
      className={`userCard ${isSelected ? 'userCardSelected' : ''}`}
      onClick={handleSelect}
    >
      <div className={'userCardContent'}>
        <div className={'userInfo'}>
          <UserAvatar name={user.name} active={user.active} />

          <div className={'userDetails'}>
            <div className={'userName'}>{user.name}</div>
            <div className={'userEmail'}>{user.email}</div>
            <UserStatusBadge active={user.active} />
          </div>
        </div>

        <div className={'userActions'}>
          <Button
            size="small"
            variant="outline"
            onClick={handleEdit}
            style={{ color: '#3b82f6', borderColor: '#3b82f6' }}
          >
            Edit
          </Button>
          <Button
            size="small"
            onClick={handleToggleStatus}
            style={{
              backgroundColor: user.active ? '#f59e0b' : '#10b981',
              color: 'white',
            }}
          >
            {user.active ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            size="small"
            onClick={handleRemove}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
            }}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
});
