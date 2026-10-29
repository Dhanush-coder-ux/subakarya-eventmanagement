import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { AvailabilitySlot, AvailabilityBlock } from '../../types';

interface DateStripProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  slots: AvailabilitySlot[];
  blocks: AvailabilityBlock[];
  daysCount?: number;
}

export const DateStrip: React.FC<DateStripProps> = ({
  selectedDate,
  onSelectDate,
  slots,
  blocks,
  daysCount = 21,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate sequence of dates starting from today
  const dates = Array.from({ length: daysCount }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;

    const weekdayShort = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const monthShort = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const dayNum = String(d.getDate()).padStart(2, '0');

    // Check if this date has a block
    const isBlocked = blocks.some((b) => {
      return dateStr >= b.startDate && dateStr <= b.endDate && b.allDay;
    });

    // Find slots on this date
    const dateSlots = slots.filter((s) => s.date === dateStr);
    const hasAvailable = dateSlots.some((s) => s.status === 'available' || (s.capacity - s.confirmedCount > 0));
    const hasLimited = dateSlots.some((s) => s.status === 'limited');
    const isBooked = dateSlots.length > 0 && dateSlots.every((s) => s.status === 'booked' || s.confirmedCount >= s.capacity);

    let statusType: 'available' | 'limited' | 'booked' | 'blocked' | 'none' = 'none';
    if (isBlocked) {
      statusType = 'blocked';
    } else if (hasAvailable) {
      statusType = 'available';
    } else if (hasLimited) {
      statusType = 'limited';
    } else if (isBooked) {
      statusType = 'booked';
    }

    return {
      dateStr,
      weekdayShort,
      monthShort,
      dayNum,
      isToday: i === 0,
      isBlocked,
      statusType,
      slotCount: dateSlots.length,
    };
  });

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-surface-card rounded-2xl border border-border p-3 sm:p-4 shadow-subtle">
      {/* Strip Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 px-1">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-wine shrink-0" />
          <span className="text-xs font-bold text-charcoal uppercase tracking-wider">
            Select Event Date
          </span>
          <span className="text-[11px] text-charcoal-muted hidden md:inline">
            (BookMyShow-Style Strip)
          </span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto">
          {/* Native Date Picker Helper */}
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate}
            onChange={(e) => e.target.value && onSelectDate(e.target.value)}
            className="text-xs py-1 px-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
            title="Pick custom date"
          />

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleScroll('left')}
              className="p-1.5 rounded-lg border border-border hover:bg-sand/30 text-charcoal transition-colors active:scale-95"
              title="Scroll previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-1.5 rounded-lg border border-border hover:bg-sand/30 text-charcoal transition-colors active:scale-95"
              title="Scroll next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontally Scrollable Date Strip */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5"
      >
        {dates.map((item) => {
          const isSelected = selectedDate === item.dateStr;

          return (
            <button
              key={item.dateStr}
              type="button"
              disabled={item.isBlocked}
              onClick={() => onSelectDate(item.dateStr)}
              className={`shrink-0 flex flex-col items-center justify-between w-[60px] sm:w-[68px] h-[80px] sm:h-[82px] py-2 px-1 rounded-xl transition-all duration-150 border text-center select-none active:scale-95 ${
                isSelected
                  ? 'bg-wine text-white border-wine shadow-sm scale-102 font-bold ring-2 ring-wine/30'
                  : item.isBlocked
                  ? 'bg-surface-muted/60 text-charcoal-light border-border/50 opacity-40 cursor-not-allowed'
                  : 'bg-surface hover:bg-sand/40 border-border text-charcoal'
              }`}
            >
              {/* Weekday & Today Pill */}
              <div className="flex flex-col items-center leading-none">
                <span
                  className={`text-[9px] sm:text-[10px] font-semibold tracking-wider ${
                    isSelected ? 'text-sand' : 'text-charcoal-muted'
                  }`}
                >
                  {item.isToday ? 'TODAY' : item.weekdayShort}
                </span>
                <span
                  className={`text-base sm:text-lg font-bold mt-1 leading-none ${
                    isSelected ? 'text-white' : 'text-charcoal'
                  }`}
                >
                  {item.dayNum}
                </span>
                <span
                  className={`text-[8px] sm:text-[9px] font-medium mt-0.5 ${
                    isSelected ? 'text-sand/80' : 'text-charcoal-light'
                  }`}
                >
                  {item.monthShort}
                </span>
              </div>

              {/* Status Indicator Dot/Pill */}
              <div className="mt-1">
                {item.isBlocked ? (
                  <span className="text-[8px] text-error font-bold uppercase">Blocked</span>
                ) : item.statusType === 'available' ? (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" title="Available" />
                ) : item.statusType === 'limited' ? (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" title="Filling Fast" />
                ) : item.statusType === 'booked' ? (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" title="Sold Out" />
                ) : (
                  <span className="inline-block w-1 h-1 rounded-full bg-charcoal-light/40" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
