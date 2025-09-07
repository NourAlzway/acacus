interface UserStatusBadgeProps {
  active: boolean;
}

export const UserStatusBadge = ({ active }: UserStatusBadgeProps) => {
  return (
    <div
      className={`userStatus ${active ? 'userStatusActive' : 'userStatusInactive'}`}
    >
      {active ? 'Active' : 'Inactive'}
    </div>
  );
};
