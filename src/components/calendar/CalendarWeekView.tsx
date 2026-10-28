import React from 'react';
import { AvailabilitySlot, AvailabilityBlock, Booking } from '../../types';
import { Clock, CheckCircle2, Ban } from 'lucide-react';

interface CalendarWeekViewProps {
  currentDate: Date;
  selectedDate: string;
  slots: AvailabilitySlot[];
  blocks: AvailabilityBlock[];
  bookings: Booking[];
  onSelectDate: (dateStr: string) => void;
  onSelectSlot: (slot: AvailabilitySlot) => void;
  onSelectBooking: (booking: Booking) => void;
}

export const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({
  currentDate,
  selectedDate,
  slots,
  blocks,
  bookings,
  onSelectDate,
  onSelectSlot,
  onSelectBooking,
}) => {
  // Get start of the week (Monday)
  const baseDate = new Date(currentDate);
  const dayOfWeek = baseDate.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(baseDate);
  monday.setDate(baseDate.getDate() + diffToMonday);

  // Generate 7 days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' });
    const dayNumber = d.getDate();
    return { date: d, dateStr, dayName, dayNumber };
  });

  // Hours range from 08:00 to 21:00
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 to 21

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-surface-card border border-border rounded-xl shadow-subtle overflow-hidden flex flex-col">
      {/* Week Header */}
      <div className="grid grid-cols-8 border-b border-border bg-sand/30 text-center sticky top-0 z-10">
        <div className="p-3 border-r border-border text-[11px] font-semibold text-charcoal-muted uppercase">
          Time
        </div>
        {weekDays.map((wd) => {
          const isToday = wd.dateStr === todayStr;
          const isSelected = wd.dateStr === selectedDate;

          const isDayBlocked = blocks.some(
            (b) => wd.dateStr >= b.startDate && wd.dateStr <= b.endDate && (!b.startTime || b.startTime === '00:00')
          );

          return (
            <button
              key={wd.dateStr}
              onClick={() => onSelectDate(wd.dateStr)}
              className={`p-2.5 border-r border-border last:border-r-0 transition-colors flex flex-col items-center justify-center ${
                isSelected ? 'bg-wine/10' : 'hover:bg-sand/40'
              }`}
            >
              <span className="text-xs uppercase font-semibold text-charcoal-muted">
                {wd.dayName}
              </span>
              <span
                className={`mt-1 text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                  isToday
                    ? 'bg-wine text-white'
                    : isSelected
                    ? 'text-wine'
                    : 'text-charcoal'
                }`}
              >
                {wd.dayNumber}
              </span>
              {isDayBlocked && (
                <span className="text-[9px] text-red-700 bg-red-100 px-1 rounded mt-0.5 font-medium flex items-center gap-0.5">
                  <Ban className="w-2 h-2" /> Blocked
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Grid Rows */}
      <div className="overflow-y-auto max-h-[620px] divide-y divide-border/60">
        {hours.map((hour) => {
          const timeLabel = `${String(hour).padStart(2, '0')}:00`;

          return (
            <div key={hour} className="grid grid-cols-8 min-h-[70px]">
              {/* Hour Label */}
              <div className="p-2 border-r border-border text-[11px] font-medium text-charcoal-muted bg-sand/10 flex items-start justify-center">
                {timeLabel}
              </div>

              {/* 7 Day Columns */}
              {weekDays.map((wd) => {
                const daySlots = slots.filter((s) => {
                  if (s.date !== wd.dateStr) return false;
                  const slotHour = parseInt(s.startTime.split(':')[0], 10);
                  return slotHour === hour;
                });

                const dayBookings = bookings.filter((b) => {
                  if (b.eventDate !== wd.dateStr) return false;
                  if (b.startTime) {
                    const bookingHour = parseInt(b.startTime.split(':')[0], 10);
                    return bookingHour === hour;
                  }
                  // If booking doesn't have hour, show at 10 AM
                  return hour === 10;
                });

                const isBlockedHour = blocks.some((b) => {
                  if (wd.dateStr < b.startDate || wd.dateStr > b.endDate) return false;
                  if (!b.startTime || b.startTime === '00:00') return true; // entire day
                  const bStart = parseInt(b.startTime.split(':')[0], 10);
                  const bEnd = parseInt(b.endTime?.split(':')[0] || '24', 10);
                  return hour >= bStart && hour < bEnd;
                });

                return (
                  <div
                    key={wd.dateStr + hour}
                    className={`p-1 border-r border-border last:border-r-0 relative group transition-colors ${
                      isBlockedHour
                        ? 'bg-red-50/20'
                        : wd.dateStr === selectedDate
                        ? 'bg-wine/[0.02]'
                        : 'hover:bg-sand/20'
                    }`}
                  >
                    {isBlockedHour && (
                      <div className="text-[9px] text-red-600/70 p-1 font-medium italic flex items-center gap-1">
                        <Ban className="w-2.5 h-2.5 shrink-0" /> Blocked
                      </div>
                    )}

                    <div className="space-y-1">
                      {/* Bookings */}
                      {dayBookings.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => onSelectBooking(b)}
                          className="w-full text-left p-1.5 rounded text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 font-medium hover:bg-emerald-200 transition-all shadow-xs block truncate"
                        >
                          <div className="flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-2.5 h-2.5 shrink-0 text-emerald-700" />
                            <span className="truncate">{b.customerName}</span>
                          </div>
                          <div className="text-[9px] opacity-80 truncate">{b.eventType}</div>
                        </button>
                      ))}

                      {/* Slots */}
                      {daySlots.map((s) => {
                        const isFull = s.confirmedCount >= s.capacity;
                        return (
                          <button
                            key={s.id}
                            onClick={() => onSelectSlot(s)}
                            className={`w-full text-left p-1.5 rounded text-[10px] border transition-all shadow-xs block truncate ${
                              isFull
                                ? 'bg-gray-100 text-charcoal-muted line-through border-border'
                                : s.status === 'unavailable'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-sand/70 hover:bg-sand text-charcoal border-border'
                            }`}
                          >
                            <div className="flex items-center gap-1 font-semibold text-wine">
                              <Clock className="w-2.5 h-2.5 shrink-0" />
                              <span>{s.startTime} - {s.endTime}</span>
                            </div>
                            <div className="truncate text-charcoal-muted text-[9px]">
                              {s.title} ({s.capacity - s.confirmedCount} left)
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
