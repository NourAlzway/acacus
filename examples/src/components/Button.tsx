import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'secondary' | 'outline';
  size?: 'small' | 'medium';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClass = 'button';
  const variantClass = {
    primary: 'buttonPrimary',
    success: 'buttonSuccess',
    secondary: 'buttonSecondary',
    outline: 'buttonOutline',
  }[variant];
  const sizeClass = size === 'small' ? 'buttonSmall' : '';

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
