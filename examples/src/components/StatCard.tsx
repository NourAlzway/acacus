import { memo } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  variant: 'blue' | 'green' | 'red' | 'purple';
}

export const StatCard = memo(function StatCard({
  label,
  value,
  variant,
}: StatCardProps) {
  const variantClass = {
    blue: 'statCardBlue',
    green: 'statCardGreen',
    red: 'statCardRed',
    purple: 'statCardPurple',
  }[variant];

  return (
    <div className={`statCard ${variantClass}`}>
      <div className={`statValue`}>{value}</div>
      <div className={`statLabel`}>{label}</div>
    </div>
  );
});
