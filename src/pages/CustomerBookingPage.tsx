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
  Sparkles,
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
    if (!pro) return [];
    return services.filter((s) => s.professionalId === pro.id);
  }, [services, pro]);

  // Selected Service
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(
    preselectedServiceId || (proServices.length > 0 ? proServices[0].id : undefined)
  );

  const selectedService = useMemo(() => {
    return proServices.find((s) => s.id === selectedServiceId);
  }, [proServices, selectedServiceId]);

  // Default selected date: today
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Selected Slot
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isCustomRequested, setIsCustomRequested] = useState(false);

  // Event Details State
  const [eventType, setEventType] = useState('Wedding Ceremony');
  const [guestCount, setGuestCount] = useState<number>(250);
  const [eventLocation, setEventLocation] = useState(pro?.coverageArea || 'Bangalore');
  const [specialNotes, setSpecialNotes] = useState('');

  // Slots for this pro
  const proSlots = useMemo(() => {
    if (!pro) return [];
    return availabilitySlots.filter((s) => s.professionalId === pro.id);
  }, [availabilitySlots, pro]);

  // Active block for this date (if any)
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

  // Selected slot object
  const selectedSlot = useMemo(() => {
    return proSlots.find((s) => s.id === selectedSlotId);
  }, [proSlots, selectedSlotId]);

  // Handle slot select
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
      <div className="max-w-md mx-auto my-24 p-8 bg-surface-card border border-border rounded-2xl text-center space-y-4 shadow-card">
        <AlertCircle className="w-12 h-12 text-wine mx-auto" />
        <h2 className="text-lg font-bold text-charcoal">Professional Not Found</h2>
        <p className="text-xs text-charcoal-muted leading-relaxed">
          The requested event professional does not exist or has been removed.
        </p>
        <Link
          to="/search"
          className="inline-block px-5 py-2.5 bg-wine text-white text-xs font-bold rounded-xl hover:bg-wine-deep transition-all shadow-subtle"
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

    const extraContext = {
      eventType,
      guestCount,
      location: eventLocation,
      notes: specialNotes,
      packagePrice: basePrice,
      startTime: selectedSlot?.startTime || '09:00',
      endTime: selectedSlot?.endTime || '17:00',
      isCustomAvailabilityRequest: isCustomRequested,
    };

    // Initiate or switch to structured chat
    const convId = initiateBookingChat(
      pro.id,
      customer,
      selectedService?.id,
      selectedDate,
      selectedSlot?.id,
      extraContext
    );

    // Save pending booking context explicitly with full fields
    setPendingBookingContext({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      professionalId: pro.id,
      professionalName: pro.businessName,
      professionalAvatar: pro.avatar,
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top back navigation */}
      <div>
        <Link
          to={`/profile/${pro.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-wine transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to {pro.businessName} profile
        </Link>
      </div>

      {/* Professional Header Banner */}
      <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={pro.avatar}
            alt={pro.businessName}
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border border-border shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-wine bg-wine/10 px-2 py-0.5 rounded">
                {pro.category}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-charcoal">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                4.9 (48 verified reviews)
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-charcoal mt-1">
              {pro.businessName}
            </h1>
            <div className="flex items-center gap-3 text-xs text-charcoal-muted mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-wine" />
                {pro.coverageArea || pro.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Event Partner
              </span>
            </div>
          </div>
        </div>

        <div className="bg-sand/40 border border-border/80 rounded-xl p-3.5 text-left md:text-right shrink-0">
          <div className="text-[11px] text-charcoal-muted uppercase tracking-wider font-semibold">
            Starting Price
          </div>
          <div className="text-xl font-bold text-charcoal mt-0.5">
            {formatINR(pro.minBookingAmount || 15000)}
          </div>
          <div className="text-[10px] text-charcoal-muted">Per event / session</div>
        </div>
      </div>

      {/* Main Grid: Date & Slot Selection + Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left Column (2 cols): Date, Slots, Services, Event Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Date Selection via BookMyShow Date Strip */}
          <section className="bg-surface-card border border-border rounded-2xl p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-wine" />
                  Select Date
                </h2>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Choose an upcoming date across the next 3 weeks
                </p>
              </div>
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
          <section className="bg-surface-card border border-border rounded-2xl p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
                  <Clock className="w-4 h-4 text-wine" />
                  Select Available Time Slot
                </h2>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Available appointment and event-day slots configured by {pro.businessName}
                </p>
              </div>
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
              <div className="p-3 bg-wine-soft/40 border border-wine/30 rounded-xl text-xs text-charcoal flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-wine shrink-0" />
                <span>
                  Custom availability requested for <strong>{selectedDate}</strong>. You can proceed to chat to finalize timing.
                </span>
              </div>
            )}
          </section>

          {/* 3. Service Package Selection */}
          {proServices.length > 0 && (
            <section className="bg-surface-card border border-border rounded-2xl p-6 shadow-subtle space-y-4">
              <div>
                <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-wine" />
                  Select Service Package
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
                      className={`text-left p-4 rounded-xl border transition-all relative ${
                        isSelected
                          ? 'border-wine bg-wine/[0.03] ring-1 ring-wine shadow-subtle'
                          : 'border-border bg-surface hover:bg-sand/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-sm text-charcoal">{svc.name}</div>
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
          <section className="bg-surface-card border border-border rounded-2xl p-6 shadow-subtle space-y-4">
            <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
              <Users className="w-4 h-4 text-wine" />
              Event Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <div className="lg:sticky lg:top-6 space-y-6">
          <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-subtle space-y-6">
            <div className="pb-4 border-b border-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-wine bg-wine/10 px-2 py-0.5 rounded">
                Booking Summary
              </span>
              <h3 className="text-base font-bold text-charcoal mt-2">
                Selected Date & Timing
              </h3>
            </div>

            {/* Selected Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-charcoal-muted">Professional:</span>
                <span className="font-semibold text-charcoal text-right">{pro.businessName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-charcoal-muted">Selected Date:</span>
                <span className="font-semibold text-charcoal">
                  {new Date(selectedDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-charcoal-muted">Time Slot:</span>
                <span className="font-semibold text-wine">
                  {selectedSlot
                    ? `${selectedSlot.startTime} – ${selectedSlot.endTime}`
                    : isCustomRequested
                    ? 'Custom Timing Requested'
                    : 'Not Selected Yet'}
                </span>
              </div>

              {selectedService && (
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-muted">Package:</span>
                  <span className="font-semibold text-charcoal text-right">{selectedService.name}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-charcoal-muted">Event Type:</span>
                <span className="font-semibold text-charcoal">{eventType}</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="pt-4 border-t border-border space-y-2 text-xs">
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
                <span className="text-wine text-base">{formatINR(totalPrice)}</span>
              </div>
              <p className="text-[10px] text-charcoal-muted italic pt-1">
                * Final pricing will be confirmed in a detailed quotation card inside chat.
              </p>
            </div>

            {/* CTA Button */}
            <div className="space-y-3">
              <button
                type="button"
                disabled={!isSelectionValid}
                onClick={handleProceedToChat}
                className={`w-full flex items-center justify-center gap-2 py-3 font-semibold text-xs rounded-xl transition-all shadow-subtle group ${
                  isSelectionValid
                    ? 'bg-wine text-white hover:bg-wine-deep cursor-pointer active:scale-98'
                    : 'bg-sand text-charcoal-muted border border-border cursor-not-allowed opacity-60'
                }`}
              >
                <span>Continue to Booking Chat</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
