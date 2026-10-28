import React, { useState } from 'react';
import { Calendar, MapPin, Users, IndianRupee, Sparkles, CheckCircle2, Send, Clock, FileText } from 'lucide-react';
import { BookingRequestData, ServiceItem, InventoryItem } from '../../types';
import { formatINR } from '../../utils';

interface BookingRequestCardProps {
  data?: BookingRequestData;
  isFormMode?: boolean;
  professionalServices: ServiceItem[];
  professionalInventory?: InventoryItem[];
  preselectedServiceId?: string;
  defaultCustomerId: string;
  defaultCustomerName: string;
  defaultCustomerPhone: string;
  onSubmit?: (request: BookingRequestData) => void;
  onCancel?: () => void;
}

export const BookingRequestCard: React.FC<BookingRequestCardProps> = ({
  data,
  isFormMode = false,
  professionalServices,
  professionalInventory = [],
  preselectedServiceId,
  defaultCustomerId,
  defaultCustomerName,
  defaultCustomerPhone,
  onSubmit,
}) => {
  // Form State
  const [eventType, setEventType] = useState(data?.eventType || 'Traditional Wedding');
  const [eventDate, setEventDate] = useState(
    data?.eventDate || new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]
  );
  const [eventLocation, setEventLocation] = useState(data?.eventLocation || 'Madurai, Tamil Nadu');
  const [guestCount, setGuestCount] = useState<number>(data?.guestCount || 350);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(
    data?.selectedServiceIds || (preselectedServiceId ? [preselectedServiceId] : [])
  );
  const [preferredTime, setPreferredTime] = useState(data?.preferredTime || 'Full Day (Morning Muhurtham & Evening Reception)');
  const [budgetRange, setBudgetRange] = useState(data?.budgetRange || '₹30,000 - ₹50,000');
  const [additionalRequirements, setAdditionalRequirements] = useState(
    data?.additionalRequirements || ''
  );
  const [formError, setFormError] = useState('');

  const toggleService = (srvId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(srvId) ? prev.filter((id) => id !== srvId) : [...prev, srvId]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventType.trim()) {
      setFormError('Please enter the event type.');
      return;
    }
    if (!eventDate) {
      setFormError('Please select the event date.');
      return;
    }
    if (!eventLocation.trim()) {
      setFormError('Please enter the event venue/location.');
      return;
    }
    if (selectedServiceIds.length === 0) {
      setFormError('Please select at least one service package.');
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
        guestCount,
        selectedServiceIds,
        preferredTime,
        budgetRange,
        additionalRequirements,
      });
    }
  };

  // If in Interactive Input Form Mode (Customer filling the booking request card)
  if (isFormMode) {
    return (
      <div className="bg-surface-card rounded-2xl border-2 border-wine/30 shadow-card p-5 max-w-xl mx-auto my-3 transition-all">
        <div className="flex items-center justify-between pb-3.5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-wine/10 text-wine flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-charcoal">Structured Booking Request</h3>
              <p className="text-xs text-charcoal-muted">Complete specifications for your service proposal</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sand text-charcoal border border-sand-dark">
            Draft Request
          </span>
        </div>

        <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
          {/* Customer Metadata (Prefilled & Read-only as required) */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-surface-muted rounded-xl border border-border/80">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                Customer Demo ID
              </label>
              <input
                type="text"
                readOnly
                value={defaultCustomerId}
                className="mt-0.5 w-full text-xs font-mono bg-transparent text-charcoal font-semibold focus:outline-none cursor-default"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                Customer Name
              </label>
              <input
                type="text"
                readOnly
                value={defaultCustomerName}
                className="mt-0.5 w-full text-xs bg-transparent text-charcoal font-semibold focus:outline-none cursor-default"
              />
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mb-1">
                <span>Event Type</span>
                <span className="text-wine">*</span>
              </label>
              <input
                type="text"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                placeholder="e.g. Wedding, Reception, Sangeet"
                className="w-full text-xs px-3 py-2 rounded-lg border border-border focus:border-wine focus:ring-1 focus:ring-wine/20 bg-surface outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-wine" />
                <span>Event Date</span>
                <span className="text-wine">*</span>
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-border focus:border-wine focus:ring-1 focus:ring-wine/20 bg-surface outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-wine" />
                <span>Venue & City</span>
                <span className="text-wine">*</span>
              </label>
              <input
                type="text"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="e.g. Aria Grand Hall, Madurai"
                className="w-full text-xs px-3 py-2 rounded-lg border border-border focus:border-wine focus:ring-1 focus:ring-wine/20 bg-surface outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-wine" />
                <span>Expected Guests</span>
              </label>
              <input
                type="number"
                min="10"
                max="5000"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-lg border border-border focus:border-wine focus:ring-1 focus:ring-wine/20 bg-surface outline-none"
              />
            </div>
          </div>

          {/* Service Selection from Professional's Live Data */}
          <div>
            <label className="text-xs font-semibold text-charcoal flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-wine" />
                <span>Required Services & Packages</span>
                <span className="text-wine">*</span>
              </span>
              <span className="text-[11px] text-charcoal-muted">
                {selectedServiceIds.length} selected
              </span>
            </label>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {professionalServices.map((service) => {
                const isSelected = selectedServiceIds.includes(service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-wine bg-wine-soft/50 shadow-xs'
                        : 'border-border bg-surface hover:bg-sand/30'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div
                        className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-wine border-wine text-white'
                            : 'border-border-dark bg-surface'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-charcoal truncate">{service.name}</p>
                        <p className="text-[11px] text-charcoal-muted line-clamp-1">{service.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-bold text-wine">{formatINR(service.basePrice)}</span>
                      <span className="text-[10px] text-charcoal-light block">
                        {service.unitLabel || service.pricingModel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Budget Range & Preferred Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-wine" />
                <span>Preferred Duration / Timing</span>
              </label>
              <input
                type="text"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                placeholder="e.g. 6:00 AM - 2:00 PM"
                className="w-full text-xs px-3 py-2 rounded-lg border border-border focus:border-wine focus:ring-1 focus:ring-wine/20 bg-surface outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5 mb-1">
                <IndianRupee className="w-3.5 h-3.5 text-wine" />
                <span>Target Budget Range</span>
              </label>
              <input
                type="text"
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                placeholder="e.g. ₹25,000 - ₹40,000"
                className="w-full text-xs px-3 py-2 rounded-lg border border-border focus:border-wine focus:ring-1 focus:ring-wine/20 bg-surface outline-none"
              />
            </div>
          </div>

          {/* Additional Requirements */}
          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1">
              Special Instructions / Creative Notes
            </label>
            <textarea
              rows={2}
              value={additionalRequirements}
              onChange={(e) => setAdditionalRequirements(e.target.value)}
              placeholder="e.g. Mention specific moments, guest dietary preferences, special stage setup or drone shots required..."
              className="w-full text-xs p-2.5 rounded-lg border border-border focus:border-wine focus:ring-1 focus:ring-wine/20 bg-surface outline-none"
            />
          </div>

          {formError && (
            <div className="p-2.5 rounded-lg bg-error-light border border-error/30 text-error text-xs">
              {formError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold tracking-wider transition-all duration-150 shadow-sm flex items-center justify-center gap-2 active:scale-98"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Booking Request to Professional</span>
          </button>
        </form>
      </div>
    );
  }

  // Submitted Structured Request Message Card View (rendered in conversation feed)
  if (!data) return null;

  return (
    <div className="bg-surface-card rounded-2xl border border-border shadow-card p-4 sm:p-5 max-w-lg my-2 text-charcoal transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-border/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-wine/10 text-wine flex items-center justify-center">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-charcoal">Booking Request Submitted</h4>
            <span className="text-[10px] text-charcoal-muted">Customer ID: {data.customerId}</span>
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
            <span className="font-semibold text-charcoal block mb-0.5">Customer Notes:</span>
            {data.additionalRequirements}
          </div>
        )}
      </div>
    </div>
  );
};
