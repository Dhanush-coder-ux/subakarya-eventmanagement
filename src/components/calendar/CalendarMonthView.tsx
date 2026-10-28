import React from 'react';
import { AvailabilitySlot, AvailabilityBlock, Booking } from '../../types';
import { Ban, Clock, CheckCircle2 } from 'lucide-react';

interface CalendarMonthViewProps {
  currentDate: Date;
  selectedDate: string; // YYYY-MM-DD
  slots: AvailabilitySlot[];
  blocks: AvailabilityBlock[];
  bookings: Booking[];
  onSelectDate: (dateStr: string) => void;
  onSelectSlot: (slot: AvailabilitySlot) => void;
  onSelectBooking: (booking: Booking) => void;
}

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  currentDate,
  selectedDate,
  slots,
  blocks,
  bookings,
  onSelectDate,
  onSelectSlot,
  onSelectBooking,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of current month
  const firstDay = new Date(year, month, 1);
  // Total days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Day of week for first day (0 = Sunday, 1 = Monday, ... 6 = Saturday)
  // Let's make Monday index 0:
  let startOffset = firstDay.getDay() - 1;
  if (startOffset === -1) startOffset = 6; // Sunday becomes 6

  // Total days in previous month
  const prevMonthDays = new Date(year, month, 0).getDate();

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const todayStr = new Date().toISOString().split('T')[0];

  // Build grid items (previous month padding + current month days + next month padding)
  interface DayCell {
    dateStr: string;
    dayNum: number;
    isCurrentMonth: boolean;
  }

  const cells: DayCell[] = [];

  // Previous month trailing days
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const prevMonthDate = new Date(year, month - 1, d);
    const dateStr = prevMonthDate.toISOString().split('T')[0];
    cells.push({ dateStr, dayNum: d, isCurrentMonth: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    cells.push({ dateStr, dayNum: d, isCurrentMonth: true });
  }

  // Next month leading days to complete the 35 or 42 grid
  const remaining = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const nextMonthDate = new Date(year, month + 1, d);
    const dateStr = nextMonthDate.toISOString().split('T')[0];
    cells.push({ dateStr, dayNum: d, isCurrentMonth: false });
  }

  return (
    <div className="bg-surface-card border border-border rounded-xl overflow-hidden shadow-subtle">
      {/* Days of week header */}
      <div className="grid grid-cols-7 border-b border-border bg-sand/30 text-center">
        {weekDays.map((wd) => (
          <div
            key={wd}
            className="py-2.5 text-xs font-semibold uppercase tracking-wider text-charcoal-muted"
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-border/60">
        {cells.map((cell) => {
          const isSelected = cell.dateStr === selectedDate;
          const isToday = cell.dateStr === todayStr;

          // Check if day is blocked
          const dayBlocks = blocks.filter((b) => {
            return cell.dateStr >= b.startDate && cell.dateStr <= b.endDate;
          });
          const isBlocked = dayBlocks.length > 0;

          // Slots on this day
          const daySlots = slots.filter((s) => s.date === cell.dateStr);

          // Bookings on this day
          const dayBookings = bookings.filter((b) => b.eventDate === cell.dateStr);

          return (
            <div
              key={cell.dateStr}
              onClick={() => onSelectDate(cell.dateStr)}
              className={`min-h-[105px] p-2 flex flex-col justify-between transition-colors cursor-pointer relative group ${
                cell.isCurrentMonth
                  ? isBlocked
                    ? 'bg-red-50/20 hover:bg-red-50/40'
                    : isSelected
                    ? 'bg-wine/5 ring-1 ring-inset ring-wine'
                    : 'bg-surface hover:bg-sand/20'
                  : 'bg-sand/10 opacity-40 hover:opacity-75'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday
                      ? 'bg-wine text-white font-bold'
                      : isSelected
                      ? 'bg-wine/10 text-wine font-bold'
                      : 'text-charcoal'
                  }`}
                >
                  {cell.dayNum}
                </span>

                {isBlocked && (
                  <span
                    className="flex items-center gap-0.5 text-[10px] font-medium text-red-700 bg-red-100/80 px-1.5 py-0.5 rounded"
                    title={dayBlocks.map((b) => b.reason || b.category).join(', ')}
                  >
                    <Ban className="w-2.5 h-2.5" />
                    Blocked
                  </span>
                )}
              </div>

              {/* Day Content Badges */}
              <div className="space-y-1 my-1 overflow-hidden">
                {/* Bookings */}
                {dayBookings.slice(0, 2).map((b) => (
                  <button
                    key={b.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBooking(b);
                    }}
                    className={`w-full text-left truncate text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1 transition-all ${
                      b.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200 hover:bg-emerald-200'
                        : b.status === 'quote_received'
                        ? 'bg-blue-100 text-blue-900 border border-blue-200 hover:bg-blue-200'
                        : 'bg-amber-100 text-amber-900 border border-amber-200 hover:bg-amber-200'
                    }`}
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{b.customerName || b.eventType}</span>
                  </button>
                ))}

                {/* Slots */}
                {daySlots.slice(0, 2).map((s) => {
                  const isFull = s.confirmedCount >= s.capacity;
                  return (
                    <button
                      key={s.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSlot(s);
                      }}
                      className={`w-full text-left truncate text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1 transition-all ${
                        isFull
                          ? 'bg-gray-100 text-charcoal-muted line-through border border-border'
                          : s.status === 'unavailable'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-sand/60 text-charcoal border border-border/80 hover:bg-sand'
                      }`}
                    >
                      <Clock className="w-2.5 h-2.5 shrink-0 text-wine" />
                      <span className="truncate">
                        {s.startTime} ({s.capacity - s.confirmedCount} left)
                      </span>
                    </button>
                  );
                })}

                {/* More indicator */}
                {daySlots.length + dayBookings.length > 4 && (
                  <div className="text-[9px] text-charcoal-muted text-right pr-1">
                    +{daySlots.length + dayBookings.length - 4} more
                  </div>
                )}
              </div>

              {/* Bottom hint on hover */}
              <div className="h-1 w-full rounded bg-transparent group-hover:bg-wine/20 transition-colors" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
