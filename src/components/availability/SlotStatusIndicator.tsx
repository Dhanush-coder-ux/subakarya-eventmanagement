import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, Clock, ShieldAlert } from 'lucide-react';
import { AvailabilitySlotStatus } from '../../types';

interface SlotStatusIndicatorProps {
  status: AvailabilitySlotStatus | 'blocked';
  remainingCapacity?: number;
  totalCapacity?: number;
  compact?: boolean;
}

export const SlotStatusIndicator: React.FC<SlotStatusIndicatorProps> = ({
  status,
  remainingCapacity,
  totalCapacity,
  compact = false,
}) => {
  switch (status) {
    case 'available':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-success-light text-success border border-success/30 ${
            compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <CheckCircle2 className={compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
          <span>
            Available
            {remainingCapacity !== undefined && totalCapacity !== undefined
              ? ` (${remainingCapacity}/${totalCapacity})`
              : ''}
          </span>
        </span>
      );

    case 'limited':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-sand text-charcoal border border-sand-dark ${
            compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <AlertCircle className={compact ? 'w-2.5 h-2.5 text-wine' : 'w-3.5 h-3.5 text-wine'} />
          <span>
            Filling Fast
            {remainingCapacity !== undefined ? ` (${remainingCapacity} left)` : ''}
          </span>
        </span>
      );

    case 'booked':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-surface-muted text-charcoal-muted border border-border ${
            compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <XCircle className={compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
          <span>Fully Booked</span>
        </span>
      );

    case 'pending':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-wine-soft text-wine border border-wine/20 ${
            compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <Clock className={compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
          <span>Pending Request</span>
        </span>
      );

    case 'blocked':
    case 'unavailable':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-error-light text-error border border-error/30 ${
            compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <ShieldAlert className={compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} />
          <span>Unavailable</span>
        </span>
      );
  }
};
