import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`p-8 sm:p-12 text-center rounded-2xl border border-dashed border-border bg-surface-muted/50 flex flex-col items-center justify-center max-w-md mx-auto ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-sand/80 text-wine flex items-center justify-center mb-3.5 shadow-xs">
          {icon}
        </div>
      )}
      <h4 className="text-sm sm:text-base font-bold text-charcoal">{title}</h4>
      {description && (
        <p className="text-xs text-charcoal-muted mt-1 leading-relaxed max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
