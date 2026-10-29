import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'wine' | 'sand' | 'success' | 'error' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-bold uppercase tracking-wider rounded-md';

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantStyles = {
    wine: 'bg-wine-soft text-wine border border-wine/20',
    sand: 'bg-sand text-charcoal border border-sand-dark',
    success: 'bg-success-light text-success border border-success/20',
    error: 'bg-error-light text-error border border-error/20',
    neutral: 'bg-surface-muted text-charcoal-muted border border-border',
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
