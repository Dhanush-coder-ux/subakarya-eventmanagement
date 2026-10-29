import React from 'react';
import {
  Sun,
  Sunset,
  Moon,
  Clock,
  Calendar,
  AlertCircle,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { AvailabilitySlot, AvailabilityBlock, AvailabilityModelType } from '../../types';
import { SlotStatusIndicator } from './SlotStatusIndicator';
import { formatINR } from '../../utils';

interface TimeSlotSelectorProps {
  selectedDate: string;
  selectedSlotId: string | null;
  onSelectSlot: (slot: AvailabilitySlot) => void;
  slots: AvailabilitySlot[];
  block?: AvailabilityBlock;
  onRequestCustomAvailability: (date: string) => void;
  availabilityModel?: AvailabilityModelType;
}

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  selectedDate,
  selectedSlotId,
  onSelectSlot,
  slots,
  block,
  onRequestCustomAvailability,
  availabilityModel = 'appointment',
}) => {
  // If date is completely blocked
  if (block) {
    return (
      <div className="bg-surface-card rounded-2xl border border-error/30 p-4 sm:p-6 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-error-light text-error flex items-center justify-center mx-auto shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-charcoal">
          Date Unavailable / Blocked by Professional
        </h4>
        <p className="text-xs text-charcoal-muted max-w-md mx-auto leading-relaxed">
          Reason: <span className="font-semibold text-charcoal">{block.reason}</span> ({block.category})
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onRequestCustomAvailability(selectedDate)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-sand border border-sand-dark text-charcoal text-xs font-semibold hover:bg-sand-dark/60 transition-colors inline-flex items-center justify-center gap-1.5 active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5 text-wine shrink-0" />
            <span>Enquire about Custom Dates via Chat</span>
          </button>
        </div>
      </div>
    );
  }

  // Filter slots for the selected date
  const dateSlots = slots.filter((s) => s.date === selectedDate);

  if (dateSlots.length === 0) {
    return (
      <div className="bg-surface-card rounded-2xl border border-border p-4 sm:p-8 text-center space-y-3">
        <Clock className="w-9 h-9 text-charcoal-light mx-auto" />
        <h4 className="text-sm font-bold text-charcoal">No Pre-Scheduled Slots on this Date</h4>
        <p className="text-xs text-charcoal-muted max-w-md mx-auto leading-relaxed">
          The professional has not configured pre-scheduled time slots for {selectedDate}. You can choose another date on the strip or request custom event timing directly.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onRequestCustomAvailability(selectedDate)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold transition-all shadow-xs inline-flex items-center justify-center gap-2 active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Request Custom Timing / Date via Chat</span>
          </button>
        </div>
      </div>
    );
  }

  // Group slots by time of day
  const morningSlots = dateSlots.filter((s) => {
    const hour = parseInt(s.startTime.split(':')[0], 10);
    return hour < 12;
  });

  const afternoonSlots = dateSlots.filter((s) => {
    const hour = parseInt(s.startTime.split(':')[0], 10);
    return hour >= 12 && hour < 17;
  });

  const eveningSlots = dateSlots.filter((s) => {
    const hour = parseInt(s.startTime.split(':')[0], 10);
    return hour >= 17;
  });

  const renderSlotGroup = (title: string, icon: any, groupSlots: AvailabilitySlot[]) => {
    if (groupSlots.length === 0) return null;
    const Icon = icon;

    return (
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-charcoal-muted">
          <Icon className="w-3.5 h-3.5 text-wine shrink-0" />
          <span>{title}</span>
          <span className="text-[10px] text-charcoal-light font-normal">
            ({groupSlots.length} slot{groupSlots.length > 1 ? 's' : ''})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {groupSlots.map((slot) => {
            const isSelected = selectedSlotId === slot.id;
            const remaining = slot.capacity - slot.confirmedCount;
            const isFull = slot.status === 'booked' || remaining <= 0;

            return (
              <button
                key={slot.id}
                type="button"
                disabled={isFull}
                onClick={() => onSelectSlot(slot)}
                className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between select-none active:scale-98 ${
                  isSelected
                    ? 'border-wine bg-wine-soft/40 shadow-card ring-2 ring-wine'
                    : isFull
                    ? 'border-border/60 bg-surface-muted/60 opacity-50 cursor-not-allowed'
                    : 'border-border bg-surface hover:border-wine/40 hover:bg-sand/20 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-charcoal tracking-wide flex items-center gap-1">
                      <Clock className="w-3 h-3 text-wine shrink-0" />
                      <span>{slot.startTime} – {slot.endTime}</span>
                    </span>

                    <SlotStatusIndicator
                      status={slot.status}
                      remainingCapacity={remaining}
                      totalCapacity={slot.capacity}
                      compact={true}
                    />
                  </div>

                  <p className="text-xs font-semibold text-charcoal line-clamp-1">{slot.title}</p>
                  {slot.notes && (
                    <p className="text-[11px] text-charcoal-muted mt-0.5 line-clamp-1">{slot.notes}</p>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] uppercase font-semibold text-charcoal-light">
                    {slot.slotType === 'event_day'
                      ? 'Full-Day Event'
                      : slot.slotType === 'venue'
                      ? 'Venue Slot'
                      : 'Session Slot'}
                  </span>
                  {slot.priceOverride && (
                    <span className="font-bold text-wine">{formatINR(slot.priceOverride)}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {renderSlotGroup('Morning Sessions', Sun, morningSlots)}
      {renderSlotGroup('Afternoon Sessions', Sunset, afternoonSlots)}
      {renderSlotGroup('Evening & Night Receptions', Moon, eveningSlots)}
    </div>
  );
};
