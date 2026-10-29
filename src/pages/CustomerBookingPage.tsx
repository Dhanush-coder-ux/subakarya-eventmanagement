import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { useAuthStore } from '../store/useAuthStore';
import { mockProfessionals } from '../data/mockUsers';
import { DateStrip } from '../components/availability/DateStrip';
import { TimeSlotSelector } from '../components/availability/TimeSlotSelector';
import { AvailabilitySlot, ServiceItem } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  Tag,
  ArrowRight,
  ShieldCheck,
  Users,
  ChevronLeft,
  Info,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { formatINR } from '../utils';

export const CustomerBookingPage: React.FC = () => {
  const { professionalId } = useParams<{ professionalId: string }>();
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get('service') || undefined;

  const navigate = useNavigate();
  const { currentUser, allProfessionals } = useAuthStore();
  const {
    services,
    availabilitySlots,
    availabilityBlocks,
    initiateBookingChat,
    setPendingBookingContext,
  } = useMarketplaceStore();

  // Find professional by checking both allProfessionals and mockProfessionals
  const pro = useMemo(() => {
    return (
      allProfessionals.find((p) => p.id === professionalId) ||
      mockProfessionals.find((p) => p.id === professionalId)
    );
  }, [allProfessionals, professionalId]);

  // Filter pro services
  const proServices = useMemo(() => {
    if (!professionalId) return [];
    return services.filter((s) => s.professionalId === professionalId);
  }, [services, professionalId]);

  // Filter pro slots
  const proSlots = useMemo(() => {
    if (!professionalId) return [];
    return availabilitySlots.filter((s) => s.professionalId === professionalId);
  }, [availabilitySlots, professionalId]);

  // Booking Form State
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(
    preselectedServiceId || (proServices[0]?.id || undefined)
  );

  const [eventType, setEventType] = useState('Wedding Ceremony');
  const [guestCount, setGuestCount] = useState<number>(250);
  const [eventLocation, setEventLocation] = useState(
    currentUser?.location || 'Madurai, Tamil Nadu'
  );
  const [specialNotes, setSpecialNotes] = useState('');
  const [isCustomRequested, setIsCustomRequested] = useState(false);

  // Active slot object
  const selectedSlot = useMemo(() => {
    if (!selectedSlotId) return null;
    return proSlots.find((s) => s.id === selectedSlotId) || null;
  }, [proSlots, selectedSlotId]);

  // Active service object
  const selectedService = useMemo(() => {
    if (!selectedServiceId) return null;
    return proServices.find((s) => s.id === selectedServiceId) || null;
  }, [proServices, selectedServiceId]);

  // Block for selected date
  const activeBlock = useMemo(() => {
    if (!pro) return undefined;
    return availabilityBlocks.find((b) => {
      return (
        b.professionalId === pro.id &&
        selectedDate >= b.startDate &&
        selectedDate <= b.endDate
      );
    });
  }, [availabilityBlocks, pro, selectedDate]);

  // Handle slot selection
  const handleSlotSelect = (slot: AvailabilitySlot) => {
    setSelectedSlotId(slot.id);
    setIsCustomRequested(false);
  };

  // Handle custom availability request
  const handleRequestCustom = (date: string) => {
    setSelectedSlotId(null);
    setIsCustomRequested(true);
    setSpecialNotes((prev) =>
      prev ? `${prev}\n[Requested custom slot on ${date}]` : `[Requested custom slot on ${date}]`
    );
  };

  // Price calculations
  const basePrice = selectedSlot?.priceOverride || selectedService?.basePrice || pro?.minBookingAmount || 15000;
  const estimatedTax = Math.round(basePrice * 0.18);
  const totalPrice = basePrice + estimatedTax;

  // Validation
  const isSelectionValid = Boolean(selectedSlotId || isCustomRequested);

  // Recovery if professional is not found
  if (!pro) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 sm:p-8 bg-surface-card border border-border rounded-2xl text-center space-y-4 shadow-card">
        <AlertCircle className="w-12 h-12 text-wine mx-auto" />
        <h2 className="text-lg font-bold text-charcoal">Professional Not Found</h2>
        <p className="text-xs text-charcoal-muted leading-relaxed">
          The requested event professional does not exist or has been removed.
        </p>
        <Link
          to="/search"
          className="inline-block px-5 py-2.5 bg-wine text-white text-xs font-bold rounded-xl hover:bg-wine-deep transition-all shadow-subtle active:scale-95"
        >
          Explore All Event Partners
        </Link>
      </div>
    );
  }

  // Handle proceed to chat
  const handleProceedToChat = () => {
    if (!isSelectionValid) return;

    const customer = currentUser
      ? {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          phone: currentUser.phone,
        }
      : {
          id: 'cust-demo',
          name: 'Priya Sharma',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
          phone: '+91 98765 43210',
        };

    const convId = initiateBookingChat(pro.id, customer, selectedServiceId);

    // Save pending context
    setPendingBookingContext({
      professionalId: pro.id,
      professionalName: pro.businessName,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      preselectedServiceId: selectedService?.id,
      selectedServiceName: selectedService?.name,
      preselectedDate: selectedDate,
      preselectedSlotId: selectedSlot?.id,
      startTime: selectedSlot?.startTime || '09:00',
      endTime: selectedSlot?.endTime || '17:00',
      timezone: 'IST (UTC+5:30)',
      packagePrice: basePrice,
      bookingType: selectedSlot?.slotType || 'appointment',
      guestCount,
      eventType,
      location: eventLocation,
      notes: specialNotes,
      isCustomAvailabilityRequest: isCustomRequested,
    });

    navigate(`/messages/${convId}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      {/* Top back navigation */}
      <div>
        <Link
          to={`/profile/${pro.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-wine transition-colors active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to {pro.businessName} profile</span>
        </Link>
      </div>

      {/* Professional Header Banner */}
      <div className="bg-surface-card border border-border rounded-2xl p-4 sm:p-6 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          <img
            src={pro.avatar}
            alt={pro.businessName}
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl object-cover border border-border shadow-xs shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-wine bg-wine/10 px-2 py-0.5 rounded shrink-0">
                {pro.category}
              </span>
              <span className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-charcoal shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                4.9 (48 reviews)
              </span>
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-charcoal mt-1 truncate">
              {pro.businessName}
            </h1>
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-charcoal-muted mt-0.5 flex-wrap">
              <span className="flex items-center gap-1 shrink-0 truncate max-w-[160px] sm:max-w-none">
                <MapPin className="w-3.5 h-3.5 text-wine shrink-0" />
                <span className="truncate">{pro.coverageArea || pro.location}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Verified Partner</span>
              </span>
            </div>
          </div>
        </div>

        <div className="bg-sand/40 border border-border/80 rounded-xl p-3 sm:p-3.5 text-left md:text-right shrink-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
          <div>
            <div className="text-[10px] sm:text-[11px] text-charcoal-muted uppercase tracking-wider font-semibold">
              Starting Price
            </div>
            <div className="text-base sm:text-xl font-bold text-charcoal mt-0.5">
              {formatINR(pro.minBookingAmount || 15000)}
            </div>
          </div>
          <div className="text-[10px] text-charcoal-muted sm:mt-0.5">Per event / session</div>
        </div>
      </div>

      {/* Main Grid: Date & Slot Selection + Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left Column (2 cols): Date, Slots, Services, Event Details */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">
          {/* 1. Date Selection via BookMyShow Date Strip */}
          <section className="bg-surface-card border border-border rounded-2xl p-4 sm:p-6 shadow-subtle space-y-3.5 sm:space-y-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-charcoal flex items-center gap-2">
                <Calendar className="w-4 h-4 text-wine shrink-0" />
                <span>Select Date</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Choose an upcoming date across the next 3 weeks
              </p>
            </div>

            <DateStrip
              selectedDate={selectedDate}
              onSelectDate={(d) => {
                setSelectedDate(d);
                setSelectedSlotId(null);
                setIsCustomRequested(false);
              }}
              slots={proSlots}
              blocks={availabilityBlocks.filter((b) => b.professionalId === pro.id)}
              daysCount={21}
            />
          </section>

          {/* 2. Time Slot Selection */}
          <section className="bg-surface-card border border-border rounded-2xl p-4 sm:p-6 shadow-subtle space-y-3.5 sm:space-y-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-charcoal flex items-center gap-2">
                <Clock className="w-4 h-4 text-wine shrink-0" />
                <span>Select Available Time Slot</span>
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Available appointment and event-day slots configured by {pro.businessName}
              </p>
            </div>

            <TimeSlotSelector
              selectedDate={selectedDate}
              selectedSlotId={selectedSlotId}
              onSelectSlot={handleSlotSelect}
              slots={proSlots}
              block={activeBlock}
              onRequestCustomAvailability={handleRequestCustom}
              availabilityModel={
                pro.category === 'Wedding & Party Hall'
                  ? 'venue'
                  : pro.category === 'Decorator & Florist' || pro.category === 'Photographer & Videographer'
                  ? 'event_day'
                  : 'appointment'
              }
            />

            {isCustomRequested && (
              <div className="p-3 bg-wine-soft/40 border border-wine/30 rounded-xl text-xs text-charcoal flex items-center gap-2 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-wine shrink-0" />
                <span>
                  Custom availability requested for <strong>{selectedDate}</strong>. You can proceed to chat to finalize timing.
                </span>
              </div>
            )}
          </section>

          {/* 3. Service Package Selection */}
          {proServices.length > 0 && (
            <section className="bg-surface-card border border-border rounded-2xl p-4 sm:p-6 shadow-subtle space-y-3.5 sm:space-y-4">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-charcoal flex items-center gap-2">
                  <Tag className="w-4 h-4 text-wine shrink-0" />
                  <span>Select Service Package</span>
                </h2>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Choose the package you would like to book or enquire about
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {proServices.map((svc) => {
                  const isSelected = svc.id === selectedServiceId;
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => setSelectedServiceId(svc.id)}
                      className={`text-left p-3.5 sm:p-4 rounded-xl border transition-all relative active:scale-98 ${
                        isSelected
                          ? 'border-wine bg-wine/[0.03] ring-1 ring-wine shadow-subtle'
                          : 'border-border bg-surface hover:bg-sand/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-sm text-charcoal truncate">{svc.name}</div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-wine shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-charcoal-muted mt-1 line-clamp-2">
                        {svc.description}
                      </p>
                      <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-xs font-semibold">
                        <span className="text-wine font-bold">{formatINR(svc.basePrice)}</span>
                        <span className="text-[11px] text-charcoal-muted font-normal">
                          {svc.unitLabel || svc.pricingModel.replace('_', ' ')}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* 4. Event Details */}
          <section className="bg-surface-card border border-border rounded-2xl p-4 sm:p-6 shadow-subtle space-y-3.5 sm:space-y-4">
            <h2 className="text-sm sm:text-base font-bold text-charcoal flex items-center gap-2">
              <Users className="w-4 h-4 text-wine shrink-0" />
              <span>Event Specifications</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Event Type
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-charcoal focus:outline-none focus:border-wine"
                >
                  <option value="Wedding Ceremony">Wedding Ceremony</option>
                  <option value="Reception">Reception</option>
                  <option value="Sangeet / Mehendi">Sangeet / Mehendi</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Birthday Celebration">Birthday Celebration</option>
                  <option value="Corporate Gala">Corporate Gala</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Other Celebration">Other Celebration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Expected Guest Count
                </label>
                <input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  min={10}
                  step={10}
                  className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-charcoal focus:outline-none focus:border-wine"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Venue / Location
                </label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="e.g. Palace Grounds, Bangalore"
                  className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-charcoal focus:outline-none focus:border-wine"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Specific Requirements or Instructions
                </label>
                <textarea
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  rows={3}
                  placeholder="Tell the professional about your timeline, theme, specific requests, or equipment needs..."
                  className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-charcoal focus:outline-none focus:border-wine resize-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (1 col): Sticky Summary Card */}
        <div className="lg:sticky lg:top-6 space-y-4 sm:space-y-6">
          <div className="bg-surface-card border border-border rounded-2xl p-4 sm:p-6 shadow-subtle space-y-4 sm:space-y-6">
            <div className="pb-3 sm:pb-4 border-b border-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-wine bg-wine/10 px-2 py-0.5 rounded">
                Booking Summary
              </span>
              <h3 className="text-base font-bold text-charcoal mt-2">
                Selected Date & Timing
              </h3>
            </div>

            {/* Selected Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-charcoal-muted shrink-0">Professional:</span>
                <span className="font-semibold text-charcoal text-right truncate">{pro.businessName}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-charcoal-muted shrink-0">Selected Date:</span>
                <span className="font-semibold text-charcoal shrink-0">
                  {new Date(selectedDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-charcoal-muted shrink-0">Time Slot:</span>
                <span className="font-semibold text-wine shrink-0 truncate">
                  {selectedSlot
                    ? `${selectedSlot.startTime} – ${selectedSlot.endTime}`
                    : isCustomRequested
                    ? 'Custom Timing Requested'
                    : 'Not Selected Yet'}
                </span>
              </div>

              {selectedService && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-charcoal-muted shrink-0">Package:</span>
                  <span className="font-semibold text-charcoal text-right truncate">{selectedService.name}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <span className="text-charcoal-muted shrink-0">Event Type:</span>
                <span className="font-semibold text-charcoal truncate">{eventType}</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="pt-3 sm:pt-4 border-t border-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-charcoal-muted">Service Base Rate</span>
                <span className="font-medium text-charcoal">{formatINR(basePrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal-muted">Estimated GST (18%)</span>
                <span className="font-medium text-charcoal">{formatINR(estimatedTax)}</span>
              </div>
              <div className="pt-2 border-t border-border/80 flex items-center justify-between text-sm font-bold text-charcoal">
                <span>Estimated Total</span>
                <span className="text-wine text-base font-bold">{formatINR(totalPrice)}</span>
              </div>
              <p className="text-[10px] text-charcoal-muted italic pt-1 leading-normal">
                * Final pricing will be confirmed in a detailed quotation card inside chat.
              </p>
            </div>

            {/* CTA Button */}
            <div className="space-y-3">
              <button
                type="button"
                disabled={!isSelectionValid}
                onClick={handleProceedToChat}
                className={`w-full flex items-center justify-center gap-2 py-3 font-semibold text-xs rounded-xl transition-all shadow-subtle group active:scale-98 ${
                  isSelectionValid
                    ? 'bg-wine text-white hover:bg-wine-deep cursor-pointer'
                    : 'bg-sand text-charcoal-muted border border-border cursor-not-allowed opacity-60'
                }`}
              >
                <span>Continue to Booking Chat</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              {!isSelectionValid && (
                <p className="text-[11px] text-wine font-medium text-center">
                  Please select an available time slot above or request custom timing to proceed.
                </p>
              )}

              <div className="flex items-start gap-2 p-3 bg-sand/30 border border-border/70 rounded-xl text-[11px] text-charcoal-muted leading-relaxed">
                <Info className="w-3.5 h-3.5 text-wine shrink-0 mt-0.5" />
                <span>
                  Selecting a slot reserves your window temporarily. The professional reviews requirements and provides an official quotation in chat.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
