import React, { useState } from 'react';
import { X, Clock, Calendar, Sparkles, Check, AlertCircle, Plus } from 'lucide-react';
import { AvailabilitySlot, ServiceItem, AvailabilityModelType } from '../../types';

interface AvailabilitySlotFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSlot: (slotData: Omit<AvailabilitySlot, 'id' | 'confirmedCount' | 'pendingHoldCount'>) => void;
  onSaveRecurring?: (config: {
    professionalId: string;
    serviceId?: string;
    title: string;
    startTime: string;
    endTime: string;
    capacity: number;
    weekdays: number[];
    startDate: string;
    endDate: string;
    priceOverride?: number;
    slotType: AvailabilityModelType;
    bufferMinutes?: number;
  }) => void;
  initialSlot?: AvailabilitySlot | null;
  professionalId: string;
  services: ServiceItem[];
  defaultDate?: string;
}

export const AvailabilitySlotForm: React.FC<AvailabilitySlotFormProps> = ({
  isOpen,
  onClose,
  onSaveSlot,
  onSaveRecurring,
  initialSlot,
  professionalId,
  services,
  defaultDate,
}) => {
  const [scheduleType, setScheduleType] = useState<'single' | 'recurring'>('single');
  const [title, setTitle] = useState(initialSlot?.title || 'Morning Photography & Candid Session');
  const [serviceId, setServiceId] = useState(initialSlot?.serviceId || (services[0]?.id || ''));
  const [date, setDate] = useState(initialSlot?.date || defaultDate || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(initialSlot?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialSlot?.endTime || '13:00');
  const [capacity, setCapacity] = useState<number>(initialSlot?.capacity || 1);
  const [bufferMinutes, setBufferMinutes] = useState<number>(initialSlot?.bufferMinutes || 30);
  const [priceOverride, setPriceOverride] = useState<number | undefined>(initialSlot?.priceOverride);
  const [slotType, setSlotType] = useState<AvailabilityModelType>(initialSlot?.slotType || 'appointment');
  const [notes, setNotes] = useState(initialSlot?.notes || '');
  const [status, setStatus] = useState(initialSlot?.status || 'available');

  // Recurring schedule state
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri
  const [recurringStartDate, setRecurringStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [recurringEndDate, setRecurringEndDate] = useState(
    new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]
  );
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const toggleWeekday = (day: number) => {
    setSelectedWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Please enter a slot title.');
      return;
    }
    if (startTime >= endTime) {
      setValidationError('End time must be strictly after start time.');
      return;
    }
    if (capacity < 1) {
      setValidationError('Capacity must be at least 1.');
      return;
    }

    setValidationError('');

    const matchedService = services.find((s) => s.id === serviceId);

    if (scheduleType === 'single') {
      onSaveSlot({
        professionalId,
        serviceId: serviceId || undefined,
        serviceCategory: matchedService?.category,
        title,
        date,
        startTime,
        endTime,
        capacity,
        bufferMinutes,
        priceOverride: priceOverride ? Number(priceOverride) : undefined,
        status: status as any,
        notes,
        slotType,
      });
    } else if (onSaveRecurring) {
      if (selectedWeekdays.length === 0) {
        setValidationError('Please select at least one weekday for recurring generation.');
        return;
      }
      onSaveRecurring({
        professionalId,
        serviceId: serviceId || undefined,
        title,
        startTime,
        endTime,
        capacity,
        weekdays: selectedWeekdays,
        startDate: recurringStartDate,
        endDate: recurringEndDate,
        priceOverride: priceOverride ? Number(priceOverride) : undefined,
        slotType,
        bufferMinutes,
      });
    }

    onClose();
  };

  const weekdaysList = [
    { num: 1, label: 'M' },
    { num: 2, label: 'T' },
    { num: 3, label: 'W' },
    { num: 4, label: 'T' },
    { num: 5, label: 'F' },
    { num: 6, label: 'S' },
    { num: 0, label: 'S' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-card rounded-2xl border border-border shadow-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-wine" />
            <h3 className="font-bold text-sm sm:text-base text-charcoal">
              {initialSlot ? 'Edit Availability Slot' : 'Create Availability Slot'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-charcoal-muted hover:text-charcoal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Schedule Mode Selector (Single vs Recurring) */}
          {!initialSlot && (
            <div className="p-1 bg-surface-muted rounded-xl flex gap-1">
              <button
                type="button"
                onClick={() => setScheduleType('single')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  scheduleType === 'single'
                    ? 'bg-wine text-white shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                Single Date Slot
              </button>
              <button
                type="button"
                onClick={() => setScheduleType('recurring')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  scheduleType === 'recurring'
                    ? 'bg-wine text-white shadow-xs'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`}
              >
                Recurring Weekly Schedule
              </button>
            </div>
          )}

          {/* Slot Title */}
          <div>
            <label className="font-semibold text-charcoal block mb-1">Slot Name / Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Morning Candid & Portrait Slot"
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
            />
          </div>

          {/* Service & Model Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-charcoal block mb-1">Applicable Service</label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
              >
                <option value="">Any / General Category</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-charcoal block mb-1">Service Model</label>
              <select
                value={slotType}
                onChange={(e) => setSlotType(e.target.value as AvailabilityModelType)}
                className="w-full px-2.5 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
              >
                <option value="appointment">Appointment / Consultation</option>
                <option value="event_day">Event-Day Service</option>
                <option value="venue">Venue Booking</option>
                <option value="rental">Equipment Rental</option>
              </select>
            </div>
          </div>

          {/* Dates depending on Single vs Recurring */}
          {scheduleType === 'single' ? (
            <div>
              <label className="font-semibold text-charcoal block mb-1">Slot Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
              />
            </div>
          ) : (
            <div className="p-3 bg-sand/30 rounded-xl border border-sand-dark space-y-3">
              <div>
                <label className="font-semibold text-charcoal block mb-1.5">
                  Repeat on Weekdays
                </label>
                <div className="flex items-center gap-1.5">
                  {weekdaysList.map((wd) => {
                    const isSelected = selectedWeekdays.includes(wd.num);
                    return (
                      <button
                        key={wd.num}
                        type="button"
                        onClick={() => toggleWeekday(wd.num)}
                        className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-wine text-white'
                            : 'bg-surface border border-border text-charcoal hover:bg-sand/40'
                        }`}
                      >
                        {wd.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-charcoal-muted uppercase block mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={recurringStartDate}
                    onChange={(e) => setRecurringStartDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-charcoal-muted uppercase block mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={recurringEndDate}
                    onChange={(e) => setRecurringEndDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-charcoal block mb-1">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
              />
            </div>
            <div>
              <label className="font-semibold text-charcoal block mb-1">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
              />
            </div>
          </div>

          {/* Capacity and Buffer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-charcoal block mb-1">Capacity</label>
              <input
                type="number"
                min="1"
                required
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine font-bold"
              />
            </div>
            <div>
              <label className="font-semibold text-charcoal block mb-1">Buffer (Mins)</label>
              <input
                type="number"
                min="0"
                step="15"
                value={bufferMinutes}
                onChange={(e) => setBufferMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
              />
            </div>
            <div>
              <label className="font-semibold text-charcoal block mb-1">Rate Override (₹)</label>
              <input
                type="number"
                placeholder="Optional"
                value={priceOverride || ''}
                onChange={(e) => setPriceOverride(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="font-semibold text-charcoal block mb-1">Internal Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Reserved crew: 2 photographers, 1 drone pilot"
              className="w-full p-2.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
            />
          </div>

          {validationError && (
            <div className="p-2.5 rounded-lg bg-error-light border border-error/30 text-error text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
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
              {scheduleType === 'recurring' ? 'Generate Recurring Slots' : 'Save Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

