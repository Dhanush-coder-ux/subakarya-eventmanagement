import React from 'react';
import { AvailabilitySlot, AvailabilityBlock, Booking } from '../../types';
import { SlotStatusIndicator } from '../availability/SlotStatusIndicator';
import {
  Clock,
  Users,
  IndianRupee,
  Plus,
  Ban,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Trash2,
  Copy,
  Edit2,
  MessageSquare,
} from 'lucide-react';
import { formatINR, formatDate } from '../../utils';

interface CalendarDayViewProps {
  selectedDate: string; // YYYY-MM-DD
  slots: AvailabilitySlot[];
  blocks: AvailabilityBlock[];
  bookings: Booking[];
  onSelectSlot: (slot: AvailabilitySlot) => void;
  onSelectBooking: (booking: Booking) => void;
  onAddSlot: () => void;
  onDuplicateSlot?: (slot: AvailabilitySlot) => void;
  onDeleteSlot?: (slotId: string) => void;
  onChangeDate: (deltaDays: number) => void;
  onOpenChat?: (booking: Booking) => void;
}

export const CalendarDayView: React.FC<CalendarDayViewProps> = ({
  selectedDate,
  slots,
  blocks,
  bookings,
  onSelectSlot,
  onSelectBooking,
  onAddSlot,
  onDuplicateSlot,
  onDeleteSlot,
  onChangeDate,
  onOpenChat,
}) => {
  const daySlots = slots.filter((s) => s.date === selectedDate);
  const dayBookings = bookings.filter((b) => b.eventDate === selectedDate);

  // Check if day is blocked
  const dayBlocks = blocks.filter((b) => {
    return selectedDate >= b.startDate && selectedDate <= b.endDate;
  });
  const isDayBlocked = dayBlocks.length > 0;

  const dateObj = new Date(selectedDate);
  const formattedDayTitle = dateObj.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Date Header Strip */}
      <div className="bg-surface-card border border-border rounded-2xl p-4 sm:p-5 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-4">
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4">
          <button
            onClick={() => onChangeDate(-1)}
            className="p-2 border border-border rounded-lg hover:bg-sand/40 text-charcoal transition-colors active:scale-95 shrink-0"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-center sm:text-left min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-charcoal truncate">{formattedDayTitle}</h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-[11px] sm:text-xs text-charcoal-muted mt-0.5">
              <span>{daySlots.length} slots</span>
              <span>•</span>
              <span>{dayBookings.length} bookings</span>
            </div>
          </div>
          <button
            onClick={() => onChangeDate(1)}
            className="p-2 border border-border rounded-lg hover:bg-sand/40 text-charcoal transition-colors active:scale-95 shrink-0"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onAddSlot}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-wine text-white text-xs font-semibold rounded-xl hover:bg-wine-deep transition-colors shadow-subtle active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Slot for this Day</span>
        </button>
      </div>

      {/* Block Warning if any */}
      {isDayBlocked && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 sm:p-4 flex items-start gap-3 text-red-900">
          <Ban className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <h4 className="text-sm font-semibold">Date Blocked from Bookings</h4>
            <div className="text-xs text-red-700 mt-1 space-y-1">
              {dayBlocks.map((b) => (
                <div key={b.id} className="truncate">
                  <span className="font-medium uppercase tracking-wide">[{b.category}]</span>{' '}
                  {b.reason ? b.reason : 'No reason specified'}{' '}
                  {b.startTime && `(${b.startTime} - ${b.endTime || 'end of day'})`}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Slots & Associated Bookings Timeline */}
      <div className="space-y-3.5 sm:space-y-4">
        {daySlots.length === 0 ? (
          <div className="bg-surface-card border border-border border-dashed rounded-xl p-8 sm:p-12 text-center">
            <Clock className="w-10 h-10 text-charcoal-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-sm sm:text-base font-semibold text-charcoal">No slots configured for this date</h3>
            <p className="text-xs text-charcoal-muted mt-1 max-w-sm mx-auto leading-relaxed">
              Customers won't be able to book you on this date unless you configure availability slots or accept custom date requests.
            </p>
            <button
              onClick={onAddSlot}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-wine text-white text-xs font-semibold rounded-lg hover:bg-wine-deep transition-colors active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Slot</span>
            </button>
          </div>
        ) : (
          daySlots.map((slot) => {
            const slotBookings = dayBookings.filter((b) => b.slotId === slot.id);
            const remaining = slot.capacity - slot.confirmedCount;

            return (
              <div
                key={slot.id}
                className="bg-surface-card border border-border rounded-2xl p-4 sm:p-5 shadow-subtle hover:border-wine/40 transition-all space-y-3 sm:space-y-4"
              >
                {/* Slot Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                  <div
                    onClick={() => onSelectSlot(slot)}
                    className="cursor-pointer group flex-1 min-w-0"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-charcoal">
                        <Clock className="w-4 h-4 text-wine shrink-0" />
                        <span>{slot.startTime} – {slot.endTime}</span>
                      </span>

                      <SlotStatusIndicator
                        status={slot.status}
                        remainingCapacity={remaining}
                        totalCapacity={slot.capacity}
                        compact={true}
                      />
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-charcoal group-hover:text-wine transition-colors mt-1 truncate">
                      {slot.title}
                    </h3>

                    {slot.notes && (
                      <p className="text-xs text-charcoal-muted mt-0.5 line-clamp-1">{slot.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50 shrink-0">
                    {slot.priceOverride && (
                      <span className="text-xs sm:text-sm font-bold text-wine">
                        {formatINR(slot.priceOverride)}
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      {onDuplicateSlot && (
                        <button
                          onClick={() => onDuplicateSlot(slot)}
                          className="p-1.5 rounded-lg border border-border hover:bg-sand/30 text-charcoal transition-colors active:scale-95"
                          title="Duplicate Slot"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteSlot && (
                        <button
                          onClick={() => onDeleteSlot(slot.id)}
                          className="p-1.5 rounded-lg border border-border hover:bg-red-50 text-red-600 transition-colors active:scale-95"
                          title="Delete Slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bookings inside this slot */}
                {slotBookings.length > 0 && (
                  <div className="pt-3 border-t border-border/70 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                      Confirmed / Pending Client Bookings ({slotBookings.length})
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {slotBookings.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => onSelectBooking(b)}
                          className="p-3 rounded-xl bg-sand/30 border border-border/80 flex items-center justify-between gap-3 cursor-pointer hover:bg-sand/50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={b.customerAvatar}
                              alt={b.customerName}
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-charcoal truncate">{b.customerName}</p>
                              <p className="text-[11px] text-charcoal-muted truncate">{b.eventType}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                b.status === 'confirmed'
                                  ? 'bg-success-light text-success'
                                  : 'bg-wine-soft text-wine'
                              }`}
                            >
                              {b.status}
                            </span>
                            {onOpenChat && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenChat(b);
                                }}
                                className="p-1 text-charcoal-muted hover:text-wine"
                                title="Open Chat"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
