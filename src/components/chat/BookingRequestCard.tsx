import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Sparkles,
  CheckCircle2,
  Send,
  Clock,
  FileText,
  Edit2,
  RotateCcw,
  Check,
  ChevronRight,
  PlusCircle,
  AlertCircle,
} from 'lucide-react';
import { BookingRequestData, ServiceItem, InventoryItem } from '../../types';
import { formatINR } from '../../utils';

interface BookingRequestCardProps {
  data?: BookingRequestData;
  isFormMode?: boolean;
  professionalId?: string;
  professionalName?: string;
  professionalServices: ServiceItem[];
  professionalInventory?: InventoryItem[];
  preselectedServiceId?: string;
  preselectedDate?: string;
  preselectedSlotId?: string;
  preselectedStartTime?: string;
  preselectedEndTime?: string;
  preselectedPrice?: number;
  preselectedEventType?: string;
  preselectedLocation?: string;
  preselectedGuestCount?: number;
  preselectedNotes?: string;
  isCustomAvailabilityRequest?: boolean;
  defaultCustomerId: string;
  defaultCustomerName: string;
  defaultCustomerPhone: string;
  onSubmit?: (request: BookingRequestData) => void;
  onCancel?: () => void;
  onChangeSlot?: () => void;
  onOpenQuotationModal?: (request: BookingRequestData) => void;
  isProfessionalView?: boolean;
}

export const BookingRequestCard: React.FC<BookingRequestCardProps> = ({
  data,
  isFormMode = false,
  professionalName,
  professionalServices,
  professionalInventory = [],
  preselectedServiceId,
  preselectedDate,
  preselectedSlotId,
  preselectedStartTime,
  preselectedEndTime,
  preselectedPrice,
  preselectedEventType,
  preselectedLocation,
  preselectedGuestCount,
  preselectedNotes,
  isCustomAvailabilityRequest,
  defaultCustomerId,
  defaultCustomerName,
  defaultCustomerPhone,
  onSubmit,
  onChangeSlot,
  onOpenQuotationModal,
  isProfessionalView = false,
}) => {
  // Form State
  const [eventType, setEventType] = useState(
    data?.eventType || preselectedEventType || 'Wedding Ceremony'
  );
  const [eventDate, setEventDate] = useState(
    data?.eventDate ||
      preselectedDate ||
      new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState(
    data?.startTime || preselectedStartTime || '09:00'
  );
  const [endTime, setEndTime] = useState(
    data?.endTime || preselectedEndTime || '17:00'
  );
  const [eventLocation, setEventLocation] = useState(
    data?.eventLocation || preselectedLocation || 'Grand Ballroom, Bangalore'
  );
  const [guestCount, setGuestCount] = useState<number>(
    data?.guestCount || preselectedGuestCount || 250
  );
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    data?.selectedServiceIds ||
      (preselectedServiceId ? [preselectedServiceId] : professionalServices[0] ? [professionalServices[0].id] : [])
  );
  const [preferredTime, setPreferredTime] = useState(
    data?.preferredTime ||
      (preselectedStartTime ? `${preselectedStartTime} – ${preselectedEndTime || 'Flexible'}` : 'Full Day')
  );
  const [budgetRange, setBudgetRange] = useState(
    data?.budgetRange || (preselectedPrice ? formatINR(preselectedPrice) : '₹25,000 – ₹50,000')
  );
  const [additionalRequirements, setAdditionalRequirements] = useState(
    data?.additionalRequirements || preselectedNotes || ''
  );
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [formError, setFormError] = useState('');

  const toggleService = (srvId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(srvId) ? prev.filter((id) => id !== srvId) : [...prev, srvId]
    );
  };

  // Calculate estimated total based on selected services
  const calculatedEstimate = selectedServiceIds.reduce((total, id) => {
    const s = professionalServices.find((item) => item.id === id);
    return total + (s?.basePrice || 0);
  }, 0) || preselectedPrice || 15000;

  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!eventType.trim()) {
      setFormError('Please specify the event type.');
      setIsEditingDetails(true);
      return;
    }
    if (!eventDate) {
      setFormError('Please select a valid event date.');
      setIsEditingDetails(true);
      return;
    }

    // Validate that the date is not in the past
    const today = new Date().toISOString().split('T')[0];
    if (eventDate < today) {
      setFormError('Event date cannot be in the past.');
      setIsEditingDetails(true);
      return;
    }

    if (!eventLocation.trim()) {
      setFormError('Please specify the venue/city location.');
      setIsEditingDetails(true);
      return;
    }
    if (selectedServiceIds.length === 0) {
      setFormError('Please select at least one service package.');
      setIsEditingDetails(true);
      return;
    }

    setFormError('');
    if (onSubmit) {
      onSubmit({
        customerId: defaultCustomerId,
        customerName: defaultCustomerName,
        customerPhone: defaultCustomerPhone,
        eventType,
        eventDate,
        eventLocation,
        slotId: preselectedSlotId || data?.slotId,
        startTime,
        endTime,
        guestCount,
        selectedServiceIds,
        preferredTime: `${startTime} – ${endTime}`,
        budgetRange: formatINR(calculatedEstimate),
        additionalRequirements,
        isCustomAvailabilityRequest,
        estimatedAmount: calculatedEstimate,
      });
    }
  };

  // ==========================================
  // MODE 1: DRAFT FORM MODE (In customer's chat)
  // ==========================================
  if (isFormMode) {
    const matchedService = professionalServices.find(
      (s) => s.id === (selectedServiceIds[0] || preselectedServiceId)
    );

    return (
      <div className="bg-surface-card rounded-2xl border-2 border-wine/30 shadow-card p-4 sm:p-5 max-w-xl mx-auto my-3 transition-all animate-in fade-in duration-200">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-wine/10 text-wine flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-charcoal">
                Structured Booking Request
              </h3>
              <p className="text-[11px] text-charcoal-muted">
                To: <strong className="text-charcoal">{professionalName || 'Professional'}</strong>
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sand text-wine border border-sand-dark">
            Draft Request
          </span>
        </div>

        {formError && (
          <div className="mt-3 p-2.5 rounded-lg bg-error-light border border-error/30 text-error text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* View Mode: Clean Prefilled Summary View */}
        {!isEditingDetails ? (
          <div className="mt-4 space-y-3.5 text-xs">
            {/* Customer & Professional Summary */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-surface-muted rounded-xl border border-border/80">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                  Customer
                </span>
                <span className="font-semibold text-charcoal">{defaultCustomerName}</span>
                <span className="text-[10px] text-charcoal-light block">ID: {defaultCustomerId}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                  Event Category
                </span>
                <span className="font-semibold text-charcoal">{eventType}</span>
              </div>
            </div>

            {/* Selected Date & Time Slot (Prefilled Automatically) */}
            <div className="p-3 bg-sand/30 border border-border rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-charcoal-muted flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-wine" />
                  <span>Selected Event Date</span>
                </span>
                <strong className="text-charcoal font-bold">
                  {new Date(eventDate).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-charcoal-muted flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-wine" />
                  <span>Reserved Slot / Window</span>
                </span>
                <strong className="text-wine font-bold">
                  {startTime} – {endTime}
                </strong>
              </div>
            </div>

            {/* Service & Pricing */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                Selected Service Package
              </span>
              <div className="p-2.5 rounded-xl bg-surface border border-border flex items-center justify-between">
                <div>
                  <span className="font-semibold text-charcoal">
                    {matchedService ? matchedService.name : 'Custom Event Package'}
                  </span>
                  <span className="text-[11px] text-charcoal-muted block">
                    Venue: {eventLocation} • {guestCount} Guests
                  </span>
                </div>
                <span className="text-sm font-bold text-wine">
                  {formatINR(calculatedEstimate)}
                </span>
              </div>
            </div>

            {additionalRequirements && (
              <div className="p-2.5 bg-surface rounded-xl border border-border/80 text-[11px] text-charcoal-muted">
                <strong className="text-charcoal block mb-0.5">Instructions:</strong>
                {additionalRequirements}
              </div>
            )}

            {/* Actions: Edit Details | Change Slot | Submit Request */}
            <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingDetails(true)}
                  className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-border hover:bg-sand/40 text-charcoal text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>

                {onChangeSlot && (
                  <button
                    type="button"
                    onClick={onChangeSlot}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-border hover:bg-sand/40 text-charcoal text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Change Slot</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleFormSubmit()}
                className="px-5 py-2.5 rounded-xl bg-wine hover:bg-wine-deep text-white text-xs font-bold flex items-center justify-center gap-2 shadow-subtle active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Booking Request</span>
              </button>
            </div>
          </div>
        ) : (
          /* Edit Mode: Interactive Inputs to customize all fields */
          <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-charcoal flex items-center gap-1 mb-1">
                  <span>Event Type</span>
                  <span className="text-wine">*</span>
                </label>
                <input
                  type="text"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  placeholder="e.g. Wedding, Reception, Sangeet"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border focus:border-wine bg-surface outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-wine" />
                  <span>Event Date</span>
                  <span className="text-wine">*</span>
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border focus:border-wine bg-surface outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-charcoal flex items-center gap-1 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-wine" />
                  <span>Venue & City</span>
                  <span className="text-wine">*</span>
                </label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="e.g. Palace Grounds, Bangalore"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border focus:border-wine bg-surface outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal flex items-center gap-1 mb-1">
                  <Users className="w-3.5 h-3.5 text-wine" />
                  <span>Expected Guests</span>
                </label>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border focus:border-wine bg-surface outline-none"
                />
              </div>
            </div>

            {/* Time Slot Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-charcoal flex items-center gap-1 mb-1">
                  <Clock className="w-3.5 h-3.5 text-wine" />
                  <span>Start Time</span>
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border focus:border-wine bg-surface outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal flex items-center gap-1 mb-1">
                  <Clock className="w-3.5 h-3.5 text-wine" />
                  <span>End Time</span>
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border focus:border-wine bg-surface outline-none"
                />
              </div>
            </div>

            {/* Service packages checklist */}
            <div>
              <label className="text-xs font-semibold text-charcoal flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-wine" />
                  <span>Requested Packages</span>
                </span>
                <span className="text-[11px] text-charcoal-muted">
                  {selectedServiceIds.length} selected
                </span>
              </label>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {professionalServices.map((service) => {
                  const isSelected = selectedServiceIds.includes(service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`p-2 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-wine bg-wine-soft/40 shadow-xs'
                          : 'border-border bg-surface hover:bg-sand/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isSelected
                              ? 'bg-wine border-wine text-white'
                              : 'border-border bg-surface'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span className="font-semibold text-charcoal">{service.name}</span>
                      </div>
                      <span className="font-bold text-wine">{formatINR(service.basePrice)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">
                Special Instructions & Requirements
              </label>
              <textarea
                rows={2}
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                placeholder="Mention timeline, stage setup, dietary requirements, or theme specifics..."
                className="w-full text-xs p-2.5 rounded-lg border border-border focus:border-wine bg-surface outline-none"
              />
            </div>

            {/* Editor Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setIsEditingDetails(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-charcoal hover:bg-sand/30"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsEditingDetails(false)}
                className="px-4 py-2 rounded-xl bg-sand border border-sand-dark text-xs font-bold text-charcoal hover:bg-sand-dark/60"
              >
                Done Editing
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-wine text-white text-xs font-bold hover:bg-wine-deep shadow-subtle"
              >
                Submit Request
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  // ==========================================
  // MODE 2: SUBMITTED REQUEST CARD IN CHAT FEED
  // ==========================================
  if (!data) return null;

  return (
    <div className="bg-surface-card rounded-2xl border border-border shadow-card p-4 sm:p-5 max-w-lg my-2 text-charcoal transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-wine/10 text-wine flex items-center justify-center">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-charcoal">Booking Request Submitted</h4>
            <span className="text-[10px] text-charcoal-muted">
              Customer: {data.customerName} ({data.customerId})
            </span>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sand text-charcoal border border-sand-dark">
          Enquiry Active
        </span>
      </div>

      <div className="mt-3.5 space-y-2.5 text-xs">
        <div className="flex justify-between py-1 border-b border-border/50">
          <span className="text-charcoal-muted">Event Type</span>
          <span className="font-semibold text-charcoal">{data.eventType}</span>
        </div>

        <div className="flex justify-between py-1 border-b border-border/50">
          <span className="text-charcoal-muted flex items-center gap-1">
            <Calendar className="w-3 h-3 text-wine" />
            <span>Event Date</span>
          </span>
          <span className="font-semibold text-charcoal">{data.eventDate}</span>
        </div>

        {(data.startTime || data.preferredTime) && (
          <div className="flex justify-between py-1 border-b border-border/50">
            <span className="text-charcoal-muted flex items-center gap-1">
              <Clock className="w-3 h-3 text-wine" />
              <span>Time Slot / Window</span>
            </span>
            <span className="font-semibold text-wine">
              {data.startTime ? `${data.startTime} – ${data.endTime || 'Flexible'}` : data.preferredTime}
            </span>
          </div>
        )}

        <div className="flex justify-between py-1 border-b border-border/50">
          <span className="text-charcoal-muted flex items-center gap-1">
            <MapPin className="w-3 h-3 text-wine" />
            <span>Venue / Location</span>
          </span>
          <span className="font-semibold text-charcoal text-right">{data.eventLocation}</span>
        </div>

        {Boolean(data.guestCount) && (
          <div className="flex justify-between py-1 border-b border-border/50">
            <span className="text-charcoal-muted flex items-center gap-1">
              <Users className="w-3 h-3 text-wine" />
              <span>Expected Guests</span>
            </span>
            <span className="font-semibold text-charcoal">{data.guestCount} Attendees</span>
          </div>
        )}

        {/* Selected Services */}
        <div className="py-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted block mb-1.5">
            Requested Services & Packages
          </span>
          <div className="space-y-1.5">
            {data.selectedServiceIds.map((srvId) => {
              const matchedService = professionalServices.find((s) => s.id === srvId);
              return (
                <div
                  key={srvId}
                  className="p-2 rounded-lg bg-surface-muted border border-border/70 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-charcoal">
                    {matchedService ? matchedService.name : srvId}
                  </span>
                  <span className="font-bold text-wine">
                    {matchedService ? formatINR(matchedService.basePrice) : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {data.additionalRequirements && (
          <div className="p-2.5 rounded-xl bg-sand/30 border border-sand-dark/50 text-[11px] text-charcoal-muted leading-relaxed">
            <span className="font-semibold text-charcoal block mb-0.5">Customer Instructions:</span>
            {data.additionalRequirements}
          </div>
        )}

        {/* Professional Response Action Bar */}
        {isProfessionalView && onOpenQuotationModal && (
          <div className="pt-3 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-charcoal-muted">Ready to respond?</span>
            <button
              type="button"
              onClick={() => onOpenQuotationModal(data)}
              className="px-3 py-1.5 rounded-xl bg-wine hover:bg-wine-deep text-white text-xs font-bold flex items-center gap-1.5 shadow-subtle active:scale-95 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Send Quotation</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
