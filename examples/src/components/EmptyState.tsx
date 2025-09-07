import { memo } from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

export const EmptyState = memo(function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className={'emptyState'}>
      <div className={'emptyStateIcon'}>{icon}</div>
      <div className={'emptyStateTitle'}>{title}</div>
      <div className={'emptyStateDescription'}>{description}</div>
    </div>
  );
});
