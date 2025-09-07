import { memo } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = memo(function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className={'emptyState'}>
      <div className={'emptyStateTitle'}>{title}</div>
      <div className={'emptyStateDescription'}>{description}</div>
    </div>
  );
});
