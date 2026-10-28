import React, { useState } from 'react';
import { Clock, CheckCircle2, Save } from 'lucide-react';
import { AvailabilityRule } from '../../types';

interface WorkingHoursEditorProps {
  workingHours: AvailabilityRule[];
  professionalId: string;
  onSaveWorkingHours: (rules: AvailabilityRule[]) => void;
}

export const WorkingHoursEditor: React.FC<WorkingHoursEditorProps> = ({
  workingHours,
  professionalId,
  onSaveWorkingHours,
}) => {
  const weekdaysOrder = [1, 2, 3, 4, 5, 6, 0]; // Mon to Sun
  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Initialize state with existing or defaults
  const [rules, setRules] = useState<AvailabilityRule[]>(() => {
    const existing = workingHours.filter((r) => r.professionalId === professionalId);
    if (existing.length > 0) return existing;

    return weekdaysOrder.map((dayNum) => ({
      id: `rule-${dayNum}`,
      professionalId,
      dayOfWeek: dayNum,
      dayName: weekdayNames[dayNum],
      isOpen: dayNum !== 0, // closed on Sunday by default
      openTime: '09:00',
      closeTime: '19:00',
      slotDurationMinutes: 180,
      bufferMinutes: 30,
    }));
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleDay = (dayOfWeek: number) => {
    setRules((prev) =>
      prev.map((r) => (r.dayOfWeek === dayOfWeek ? { ...r, isOpen: !r.isOpen } : r))
    );
  };

  const handleChangeTime = (dayOfWeek: number, field: 'openTime' | 'closeTime', value: string) => {
    setRules((prev) =>
      prev.map((r) => (r.dayOfWeek === dayOfWeek ? { ...r, [field]: value } : r))
    );
  };

  const handleSave = () => {
    onSaveWorkingHours(rules);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
            <Clock className="w-4 h-4 text-wine" />
            <span>Weekly Working Hours</span>
          </h3>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Default operational schedule for customer appointment and slot generation
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-3.5 py-1.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Hours</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-2.5 rounded-xl bg-success-light text-success text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Working hours updated successfully!</span>
        </div>
      )}

      <div className="divide-y divide-border/60">
        {weekdaysOrder.map((dayNum) => {
          const rule = rules.find((r) => r.dayOfWeek === dayNum) || {
            id: `rule-${dayNum}`,
            professionalId,
            dayOfWeek: dayNum,
            dayName: weekdayNames[dayNum],
            isOpen: true,
            openTime: '09:00',
            closeTime: '19:00',
            slotDurationMinutes: 180,
            bufferMinutes: 30,
          };

          return (
            <div
              key={dayNum}
              className="py-2.5 flex items-center justify-between gap-3 text-xs"
            >
              {/* Day & Open Toggle */}
              <div className="flex items-center gap-3 w-32">
                <input
                  type="checkbox"
                  id={`toggle-${dayNum}`}
                  checked={rule.isOpen}
                  onChange={() => handleToggleDay(dayNum)}
                  className="w-4 h-4 rounded text-wine accent-wine focus:ring-wine cursor-pointer"
                />
                <label
                  htmlFor={`toggle-${dayNum}`}
                  className={`font-semibold cursor-pointer select-none ${
                    rule.isOpen ? 'text-charcoal' : 'text-charcoal-muted line-through'
                  }`}
                >
                  {rule.dayName}
                </label>
              </div>

              {/* Open / Close Time inputs */}
              {rule.isOpen ? (
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <input
                    type="time"
                    value={rule.openTime}
                    onChange={(e) => handleChangeTime(dayNum, 'openTime', e.target.value)}
                    className="px-2.5 py-1 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine font-semibold"
                  />
                  <span className="text-charcoal-muted">to</span>
                  <input
                    type="time"
                    value={rule.closeTime}
                    onChange={(e) => handleChangeTime(dayNum, 'closeTime', e.target.value)}
                    className="px-2.5 py-1 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine font-semibold"
                  />
                </div>
              ) : (
                <span className="text-xs font-semibold text-charcoal-light py-1">
                  Closed / Not Booking
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

