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

  const dayBlocks = blocks.filter(
    (b) => selectedDate >= b.startDate && selectedDate <= b.endDate
  );
  const isDayBlocked = dayBlocks.length > 0;

  // Formatted date string
  const d = new Date(selectedDate);
  const formattedDayTitle = isNaN(d.getTime())
    ? selectedDate
    : d.toLocaleDateString('en-IN', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

  return (
    <div className="space-y-6">
      {/* Day Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-card p-4 rounded-xl border border-border shadow-subtle">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onChangeDate(-1)}
            className="p-2 border border-border rounded-lg hover:bg-sand/40 text-charcoal transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-charcoal">{formattedDayTitle}</h2>
            <div className="flex items-center gap-2 text-xs text-charcoal-muted mt-0.5">
              <span>{daySlots.length} availability slots</span>
              <span>•</span>
              <span>{dayBookings.length} bookings scheduled</span>
            </div>
          </div>
          <button
            onClick={() => onChangeDate(1)}
            className="p-2 border border-border rounded-lg hover:bg-sand/40 text-charcoal transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onAddSlot}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-wine text-white text-xs font-semibold rounded-lg hover:bg-wine-deep transition-colors shadow-subtle"
        >
          <Plus className="w-4 h-4" />
          Add Slot for this Day
        </button>
      </div>

      {/* Block Warning if any */}
      {isDayBlocked && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-900">
          <Ban className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold">Date Blocked from Bookings</h4>
            <div className="text-xs text-red-700 mt-1 space-y-1">
              {dayBlocks.map((b) => (
                <div key={b.id}>
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
      <div className="space-y-4">
        {daySlots.length === 0 ? (
          <div className="bg-surface-card border border-border border-dashed rounded-xl p-12 text-center">
            <Clock className="w-10 h-10 text-charcoal-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-semibold text-charcoal">No slots configured for this date</h3>
            <p className="text-xs text-charcoal-muted mt-1 max-w-sm mx-auto">
              Customers won't be able to book you on this date unless you configure availability slots or accept custom date requests.
            </p>
            <button
              onClick={onAddSlot}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-wine text-white text-xs font-semibold rounded-lg hover:bg-wine-deep transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Slot
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {daySlots.map((slot) => {
              const remaining = slot.capacity - slot.confirmedCount;
              const slotBookings = dayBookings.filter((b) => b.slotId === slot.id);

              return (
                <div
                  key={slot.id}
                  className="bg-surface-card border border-border rounded-xl p-5 shadow-subtle hover:border-wine/40 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <SlotStatusIndicator status={slot.status} remainingCapacity={remaining} />
                        <span className="text-xs font-bold text-wine bg-wine/10 px-2 py-0.5 rounded">
                          {slot.startTime} – {slot.endTime}
                        </span>
                        {slot.serviceCategory && (
                          <span className="text-xs text-charcoal-muted border border-border px-2 py-0.5 rounded bg-sand/30">
                            {slot.serviceCategory}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-charcoal">{slot.title}</h3>
                      {slot.notes && (
                        <p className="text-xs text-charcoal-muted">{slot.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {onDuplicateSlot && (
                        <button
                          onClick={() => onDuplicateSlot(slot)}
                          className="p-1.5 border border-border rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-sand/40 transition-colors"
                          title="Duplicate Slot"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                      {onDeleteSlot && (
                        <button
                          onClick={() => {
                            if (slot.confirmedCount > 0) {
                              alert('Cannot delete slot with confirmed bookings.');
                              return;
                            }
                            if (confirm('Delete this availability slot?')) {
                              onDeleteSlot(slot.id);
                            }
                          }}
                          className="p-1.5 border border-border rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onSelectSlot(slot)}
                        className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-charcoal hover:bg-sand/40 transition-colors"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>

                  {/* Slot Details Bar */}
                  <div className="mt-4 pt-3 border-t border-border/70 flex flex-wrap items-center gap-4 text-xs text-charcoal-muted">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-wine" />
                      <span>
                        Capacity:{' '}
                        <strong className="text-charcoal">
                          {slot.confirmedCount} / {slot.capacity} booked
                        </strong>
                      </span>
                    </div>

                    {slot.priceOverride ? (
                      <div className="flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-wine" />
                        <span>
                          Price:{' '}
                          <strong className="text-charcoal">{formatINR(slot.priceOverride)}</strong>
                        </span>
                      </div>
                    ) : null}

                    {slot.durationMinutes && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-wine" />
                        <span>Duration: {slot.durationMinutes} mins</span>
                      </div>
                    )}
                  </div>

                  {/* Associated Bookings in this slot */}
                  {slotBookings.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border/70">
                      <h5 className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
                        Bookings in this slot ({slotBookings.length})
                      </h5>
                      <div className="space-y-2">
                        {slotBookings.map((b) => (
                          <div
                            key={b.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-sand/30 border border-border text-xs"
                          >
                            <div className="space-y-0.5">
                              <div className="font-semibold text-charcoal flex items-center gap-2">
                                <span>{b.customerName}</span>
                                <span className="text-[10px] bg-wine/10 text-wine px-1.5 py-0.2 rounded font-medium">
                                  {b.eventType}
                                </span>
                              </div>
                              <div className="text-charcoal-muted">
                                {b.guestCount ? `${b.guestCount} guests • ` : ''}
                                {formatINR(b.totalAmount || 0)}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onSelectBooking(b)}
                                className="px-2.5 py-1 border border-border rounded text-[11px] font-medium hover:bg-surface transition-colors"
                              >
                                View File
                              </button>
                              {onOpenChat && (
                                <button
                                  onClick={() => onOpenChat(b)}
                                  className="p-1.5 bg-wine text-white rounded hover:bg-wine-deep transition-colors"
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
            })}
          </div>
        )}
      </div>
    </div>
  );
};
