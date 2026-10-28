import React, { useState } from 'react';
import { X, ShieldAlert, Calendar, AlertCircle } from 'lucide-react';
import { AvailabilityBlock } from '../../types';

interface AvailabilityBlockFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBlock: (block: Omit<AvailabilityBlock, 'id'>) => void;
  professionalId: string;
}

export const AvailabilityBlockForm: React.FC<AvailabilityBlockFormProps> = ({
  isOpen,
  onClose,
  onSaveBlock,
  professionalId,
}) => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [allDay, setAllDay] = useState(true);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [category, setCategory] = useState<AvailabilityBlock['category']>('Personal Leave');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason or note for this block.');
      return;
    }
    if (startDate > endDate) {
      setError('End date must be on or after start date.');
      return;
    }

    onSaveBlock({
      professionalId,
      startDate,
      endDate,
      startTime: allDay ? undefined : startTime,
      endTime: allDay ? undefined : endTime,
      allDay,
      category,
      reason,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-card rounded-2xl border border-border shadow-elevated w-full max-w-md p-6">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-wine" />
            <h3 className="font-bold text-sm text-charcoal">Block Dates or Hours</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-charcoal-muted hover:text-charcoal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-charcoal block mb-1">Block Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-2.5 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
            >
              <option value="Personal Leave">Personal Leave / Out of Town</option>
              <option value="Holiday">Official Holiday / Festival</option>
              <option value="Maintenance">Equipment / Studio Maintenance</option>
              <option value="External Event">Booked for External Event</option>
              <option value="Other">Other Unavailable Period</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-charcoal block mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
              />
            </div>
            <div>
              <label className="font-semibold text-charcoal block mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="allDayBlock"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="w-4 h-4 rounded text-wine accent-wine focus:ring-wine cursor-pointer"
            />
            <label htmlFor="allDayBlock" className="font-semibold text-charcoal cursor-pointer select-none">
              Block entire full day(s)
            </label>
          </div>

          {!allDay && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-surface-muted rounded-xl border border-border">
              <div>
                <label className="font-semibold text-charcoal block mb-1">Block From</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg border border-border bg-surface text-charcoal outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-charcoal block mb-1">Block Until</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg border border-border bg-surface text-charcoal outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="font-semibold text-charcoal block mb-1">Reason / Notes</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Studio renovation or wedding out of city"
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-error-light border border-error/30 text-error text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-charcoal font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-wine hover:bg-wine-dark text-white font-bold"
            >
              Save Block
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

