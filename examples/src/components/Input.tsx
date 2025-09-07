import { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className={`inputGroup`}>
      {label && <label className={`label`}>{label}</label>}
      <input className={`input ${className}`} {...props} />
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: React.ReactNode;
}

export function Select({
  label,
  className = '',
  children,
  ...props
}: SelectProps) {
  return (
    <div className={`inputGroup`}>
      {label && <label className={`label`}>{label}</label>}
      <select className={`select ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
}
