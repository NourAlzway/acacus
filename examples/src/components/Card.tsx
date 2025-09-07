import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  headerContent?: ReactNode;
  className?: string;
  minHeight?: string;
}

export function Card({
  title,
  children,
  headerContent,
  className,
  minHeight,
}: CardProps) {
  return (
    <div className={`card ${className || ''}`} style={{ minHeight }}>
      {(title || headerContent) && (
        <div className={`cardHeader`}>
          {title && <h3 className={`cardTitle`}>{title}</h3>}
          {headerContent}
        </div>
      )}
      {children}
    </div>
  );
}
