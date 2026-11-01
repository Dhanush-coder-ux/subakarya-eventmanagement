import React from 'react';
import { RepostRequestStatus } from '../../types';
import { Clock, CheckCircle2, XCircle, AlertCircle, Trash2 } from 'lucide-react';

interface RepostStatusBadgeProps {
  status: RepostRequestStatus;
  className?: string;
  size?: 'sm' | 'md';
}

export const RepostStatusBadge: React.FC<RepostStatusBadgeProps> = ({
  status,
  className = '',
  size = 'md',
}) => {
  const isSmall = size === 'sm';
  const sizeClasses = isSmall
    ? 'px-2 py-0.5 text-[10px] gap-1'
    : 'px-2.5 py-1 text-xs gap-1.5 font-semibold';

  switch (status) {
    case 'PENDING':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-sand text-charcoal border border-sand-dark font-medium ${sizeClasses} ${className}`}
        >
          <Clock className={isSmall ? 'w-2.5 h-2.5 text-wine' : 'w-3.5 h-3.5 text-wine'} />
          <span>Pending Approval</span>
        </span>
      );
    case 'APPROVED':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-success-light text-success border border-success/30 font-medium ${sizeClasses} ${className}`}
        >
          <CheckCircle2 className={isSmall ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
          <span>Approved & Published</span>
        </span>
      );
    case 'REJECTED':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-error-light text-error border border-error/30 font-medium ${sizeClasses} ${className}`}
        >
          <XCircle className={isSmall ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
          <span>Declined</span>
        </span>
      );
    case 'REVOKED':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-surface-muted text-charcoal-muted border border-border font-medium ${sizeClasses} ${className}`}
        >
          <AlertCircle className={isSmall ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
          <span>Permission Revoked</span>
        </span>
      );
    case 'REMOVED_BY_CUSTOMER':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-surface-muted text-charcoal-muted border border-border font-medium ${sizeClasses} ${className}`}
        >
          <Trash2 className={isSmall ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
          <span>Removed by Customer</span>
        </span>
      );
    default:
      return null;
  }
};

