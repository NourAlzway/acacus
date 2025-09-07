import { memo } from 'react';

interface UserAvatarProps {
  name: string;
  active: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const UserAvatar = memo(function UserAvatar({
  name,
  active,
  size = 'medium',
}: UserAvatarProps) {
  const sizeClass = {
    small: { width: '32px', height: '32px', fontSize: '14px' },
    medium: { width: '40px', height: '40px', fontSize: '16px' },
    large: { width: '48px', height: '48px', fontSize: '20px' },
  }[size];

  const colorClass = active ? 'userAvatarActive' : 'userAvatarInactive';

  return (
    <div className={`userAvatar ${colorClass}`} style={sizeClass}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
});
