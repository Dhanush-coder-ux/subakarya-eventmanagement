import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Tag,
  CheckCircle2,
  Send,
  Clock,
  FileText,
  Edit2,
  RotateCcw,
  Check,
  PlusCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
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
  const calculatedEstimate =
    selectedServiceIds.reduce((total, id) => {
      const s = professionalServices.find((item) => item.id === id);
      return total + (s?.basePrice || 0);
    }, 0) ||
    preselectedPrice ||
    15000;

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
  // MODE 1: COMPACT DRAFT BOOKING REQUEST CARD
  // ==========================================
  if (isFormMode) {
    const matchedService = professionalServices.find(
      (s) => s.id === (selectedServiceIds[0] || preselectedServiceId)
    );

    return (
      <div className="bg-surface-card rounded-2xl border border-wine/25 shadow-subtle p-3.5 sm:p-4 w-full max-w-md my-2.5 transition-all text-xs text-charcoal animate-in fade-in duration-150">
        {/* Compact Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-wine/10 text-wine flex items-center justify-center font-bold shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight">
              <h4 className="font-bold text-xs text-charcoal">
                Booking Request Draft
              </h4>
              <p className="text-[10px] text-charcoal-muted">
                To: <span className="font-semibold text-charcoal">{professionalName || 'Professional'}</span>
              </p>
            </div>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sand text-wine border border-sand-dark">
            Draft
          </span>
        </div>

        {formError && (
          <div className="mt-2 p-2 rounded-lg bg-error-light border border-error/30 text-error text-[11px] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* View Mode: Compact Summary Info */}
        {!isEditingDetails ? (
          <div className="mt-2.5 space-y-2">
            {/* Date & Time pill row */}
            <div className="p-2.5 bg-sand/25 border border-border/80 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-charcoal-muted flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3 h-3 text-wine" />
                  <span>{new Date(eventDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </span>
                <span className="text-[11px] font-bold text-wine flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{startTime} – {endTime}</span>
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px]">
                <span className="text-charcoal-muted truncate flex items-center gap-1">
                  <Tag className="w-3 h-3 text-wine shrink-0" />
                  <span className="truncate">{matchedService ? matchedService.name : eventType}</span>
                </span>
                <span className="font-bold text-charcoal shrink-0">
                  {formatINR(calculatedEstimate)}
                </span>
              </div>
            </div>

            {/* Location & Guest count */}
            <div className="flex items-center justify-between px-1 text-[11px] text-charcoal-muted">
              <span className="flex items-center gap-1 truncate max-w-[60%]">
                <MapPin className="w-3 h-3 text-wine shrink-0" />
                <span className="truncate">{eventLocation}</span>
              </span>
              <span className="flex items-center gap-1 shrink-0">
                <Users className="w-3 h-3 text-wine shrink-0" />
                <span>{guestCount} guests</span>
              </span>
            </div>

            {additionalRequirements && (
              <div className="p-2 bg-surface rounded-lg border border-border/60 text-[10px] text-charcoal-muted line-clamp-2">
                <strong className="text-charcoal">Note: </strong>
                {additionalRequirements}
              </div>
            )}

            {/* Compact Action Buttons */}
            <div className="pt-2 border-t border-border flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditingDetails(true)}
                className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-sand/30 text-[11px] font-semibold text-charcoal transition-colors flex items-center gap-1"
                title="Edit Details"
              >
                <Edit2 className="w-3 h-3 text-charcoal-muted" />
                <span>Edit</span>
              </button>

              {onChangeSlot && (
                <button
                  type="button"
                  onClick={onChangeSlot}
                  className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-sand/30 text-[11px] font-semibold text-charcoal transition-colors flex items-center gap-1"
                  title="Pick a different date or slot"
                >
                  <RotateCcw className="w-3 h-3 text-charcoal-muted" />
                  <span>Change Slot</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleFormSubmit()}
                className="flex-1 py-1.5 px-3 rounded-lg bg-wine hover:bg-wine-deep text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-subtle active:scale-98 transition-all"
              >
                <Send className="w-3 h-3" />
                <span>Submit Request</span>
              </button>
            </div>
          </div>
        ) : (
          /* Inline Edit Mode */
          <form onSubmit={handleFormSubmit} className="mt-2.5 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-charcoal mb-0.5 block">
                  Event Type
                </label>
                <input
                  type="text"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-surface outline-none focus:border-wine"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-charcoal mb-0.5 block">
                  Event Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-surface outline-none focus:border-wine"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-charcoal mb-0.5 block">
                  Venue & City
                </label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-surface outline-none focus:border-wine"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-charcoal mb-0.5 block">
                  Guest Count
                </label>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-surface outline-none focus:border-wine"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-charcoal mb-0.5 block">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-surface outline-none focus:border-wine"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-charcoal mb-0.5 block">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-surface outline-none focus:border-wine"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-[10px] font-semibold text-charcoal mb-0.5 block">
                Special Instructions
              </label>
              <textarea
                rows={2}
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                placeholder="Mention timeline, stage setup, dietary requirements..."
                className="w-full text-xs p-2 rounded-lg border border-border bg-surface outline-none focus:border-wine"
              />
            </div>

            {/* Editor Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setIsEditingDetails(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-[11px] font-semibold text-charcoal hover:bg-sand/30"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsEditingDetails(false)}
                className="px-3 py-1.5 rounded-lg bg-sand border border-sand-dark text-[11px] font-bold text-charcoal hover:bg-sand-dark/60"
              >
                Done
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-wine text-white text-[11px] font-bold hover:bg-wine-deep shadow-subtle"
              >
                Submit
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
    <div className="bg-surface-card rounded-2xl border border-border shadow-subtle p-3.5 sm:p-4 w-full max-w-sm sm:max-w-md my-1.5 text-charcoal transition-all text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-wine/10 text-wine flex items-center justify-center shrink-0">
            <FileText className="w-3 h-3" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-charcoal leading-none">Booking Request</h4>
            <span className="text-[9px] text-charcoal-muted">
              Customer: {data.customerName}
            </span>
          </div>
        </div>
        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-sand text-charcoal border border-sand-dark">
          Enquiry Active
        </span>
      </div>

      <div className="mt-2.5 space-y-2 text-xs">
        <div className="flex justify-between py-1 border-b border-border/50 text-[11px]">
          <span className="text-charcoal-muted">Event Type</span>
          <span className="font-semibold text-charcoal">{data.eventType}</span>
        </div>

        <div className="flex justify-between py-1 border-b border-border/50 text-[11px]">
          <span className="text-charcoal-muted flex items-center gap-1">
            <Calendar className="w-3 h-3 text-wine" />
            <span>Event Date</span>
          </span>
          <span className="font-semibold text-charcoal">{data.eventDate}</span>
        </div>

        {(data.startTime || data.preferredTime) && (
          <div className="flex justify-between py-1 border-b border-border/50 text-[11px]">
            <span className="text-charcoal-muted flex items-center gap-1">
              <Clock className="w-3 h-3 text-wine" />
              <span>Time Slot</span>
            </span>
            <span className="font-semibold text-wine">
              {data.startTime ? `${data.startTime} – ${data.endTime || 'Flexible'}` : data.preferredTime}
            </span>
          </div>
        )}

        <div className="flex justify-between py-1 border-b border-border/50 text-[11px]">
          <span className="text-charcoal-muted flex items-center gap-1">
            <MapPin className="w-3 h-3 text-wine" />
            <span>Venue</span>
          </span>
          <span className="font-semibold text-charcoal text-right truncate max-w-[65%]">{data.eventLocation}</span>
        </div>

        {Boolean(data.guestCount) && (
          <div className="flex justify-between py-1 border-b border-border/50 text-[11px]">
            <span className="text-charcoal-muted flex items-center gap-1">
              <Users className="w-3 h-3 text-wine" />
              <span>Expected Guests</span>
            </span>
            <span className="font-semibold text-charcoal">{data.guestCount} Attendees</span>
          </div>
        )}

        {/* Selected Services */}
        {data.selectedServiceIds.length > 0 && (
          <div className="pt-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block mb-1">
              Requested Services
            </span>
            <div className="space-y-1">
              {data.selectedServiceIds.map((srvId) => {
                const matchedService = professionalServices.find((s) => s.id === srvId);
                return (
                  <div
                    key={srvId}
                    className="p-1.5 rounded-lg bg-surface-muted border border-border/60 flex items-center justify-between text-[11px]"
                  >
                    <span className="font-medium text-charcoal truncate">
                      {matchedService ? matchedService.name : srvId}
                    </span>
                    <span className="font-bold text-wine shrink-0">
                      {matchedService ? formatINR(matchedService.basePrice) : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {data.additionalRequirements && (
          <div className="p-2 rounded-lg bg-sand/30 border border-sand-dark/40 text-[10px] text-charcoal-muted leading-relaxed">
            <strong className="text-charcoal block mb-0.5">Instructions:</strong>
            {data.additionalRequirements}
          </div>
        )}

        {/* Professional Response Action Bar */}
        {isProfessionalView && onOpenQuotationModal && (
          <div className="pt-2.5 border-t border-border flex items-center justify-between">
            <span className="text-[10px] text-charcoal-muted font-medium">Respond to enquiry:</span>
            <button
              type="button"
              onClick={() => onOpenQuotationModal(data)}
              className="px-3 py-1.5 rounded-lg bg-wine hover:bg-wine-deep text-white text-[11px] font-bold flex items-center gap-1.5 shadow-subtle active:scale-95 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Quotation</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
