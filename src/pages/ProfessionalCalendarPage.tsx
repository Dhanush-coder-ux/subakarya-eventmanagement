import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { CalendarMonthView } from '../components/calendar/CalendarMonthView';
import { CalendarWeekView } from '../components/calendar/CalendarWeekView';
import { CalendarDayView } from '../components/calendar/CalendarDayView';
import { BookingDetailsDrawer } from '../components/calendar/BookingDetailsDrawer';
import { AvailabilitySlotForm } from '../components/availability/AvailabilitySlotForm';
import { AvailabilityBlockForm } from '../components/availability/AvailabilityBlockForm';
import { AvailabilitySlot, Booking } from '../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Ban,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';

export const ProfessionalCalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const proId = currentUser?.id || 'pro-1';

  const {
    availabilitySlots,
    availabilityBlocks,
    bookings,
    services,
    addAvailabilitySlot,
    deleteAvailabilitySlot,
    duplicateAvailabilitySlot,
    createRecurringSlots,
    addAvailabilityBlock,
    updateBookingStatus,
    setActiveConversation,
    conversations,
  } = useMarketplaceStore();

  const proServices = useMemo(() => {
    return services.filter((s) => s.professionalId === proId);
  }, [services, proId]);

  const proSlots = useMemo(() => {
    return availabilitySlots.filter((s) => s.professionalId === proId);
  }, [availabilitySlots, proId]);

  const proBlocks = useMemo(() => {
    return availabilityBlocks.filter((b) => b.professionalId === proId);
  }, [availabilityBlocks, proId]);

  const proBookings = useMemo(() => {
    return bookings.filter((b) => b.professionalId === proId);
  }, [bookings, proId]);

  // Calendar State
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Drawer / Inspection state
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modals state
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  // Month navigation helpers
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') {
      d.setMonth(d.getMonth() - 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() - 7);
    } else {
      d.setDate(d.getDate() - 1);
    }
    setCurrentDate(d);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') {
      d.setMonth(d.getMonth() + 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() + 7);
    } else {
      d.setDate(d.getDate() + 1);
    }
    setCurrentDate(d);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today.toISOString().split('T')[0]);
  };

  const handleDateChangeDelta = (delta: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    const newStr = d.toISOString().split('T')[0];
    setSelectedDate(newStr);
    setCurrentDate(d);
  };

  // Click on slot
  const handleSelectSlot = (slot: AvailabilitySlot) => {
    setSelectedSlot(slot);
    setSelectedBooking(null);
    setIsDrawerOpen(true);
  };

  // Click on booking
  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    // Find slot if matched
    const matchedSlot = proSlots.find((s) => s.id === booking.slotId) || null;
    setSelectedSlot(matchedSlot);
    setIsDrawerOpen(true);
  };

  // Open chat for a booking
  const handleOpenChat = (booking: Booking) => {
    // Find conversation
    const conv = conversations.find(
      (c) =>
        c.professionalId === booking.professionalId &&
        c.customerId === booking.customerId
    );
    if (conv) {
      setActiveConversation(conv.id);
    }
    navigate('/chat');
  };

  // Title formatting
  const formattedHeaderTitle = useMemo(() => {
    return currentDate.toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric',
    });
  }, [currentDate]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Top Bar with Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-card p-4 rounded-2xl border border-border shadow-subtle">
        {/* Navigation & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-border rounded-lg bg-surface p-0.5">
            <button
              onClick={handlePrev}
              className="p-1.5 hover:bg-sand/40 rounded text-charcoal transition-colors"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-semibold text-charcoal hover:bg-sand/40 rounded transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 hover:bg-sand/40 rounded text-charcoal transition-colors"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h1 className="text-lg md:text-xl font-bold text-charcoal flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-wine" />
            {formattedHeaderTitle}
          </h1>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Pills */}
          <div className="flex items-center border border-border rounded-lg bg-sand/30 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded transition-all ${
                viewMode === 'month'
                  ? 'bg-wine text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded transition-all ${
                viewMode === 'week'
                  ? 'bg-wine text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded transition-all ${
                viewMode === 'day'
                  ? 'bg-wine text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Day
            </button>
          </div>

          {/* Block Dates Button */}
          <button
            onClick={() => setIsBlockModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-red-300 text-red-800 bg-red-50/60 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Block Dates</span>
          </button>

          {/* Add Slot Button */}
          <button
            onClick={() => setIsSlotModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-wine text-white rounded-lg text-xs font-semibold hover:bg-wine-deep transition-colors shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Slot</span>
          </button>
        </div>
      </div>

      {/* Main Calendar View Rendering */}
      <div>
        {viewMode === 'month' && (
          <CalendarMonthView
            currentDate={currentDate}
            selectedDate={selectedDate}
            slots={proSlots}
            blocks={proBlocks}
            bookings={proBookings}
            onSelectDate={(d) => {
              setSelectedDate(d);
              setViewMode('day');
            }}
            onSelectSlot={handleSelectSlot}
            onSelectBooking={handleSelectBooking}
          />
        )}

        {viewMode === 'week' && (
          <CalendarWeekView
            currentDate={currentDate}
            selectedDate={selectedDate}
            slots={proSlots}
            blocks={proBlocks}
            bookings={proBookings}
            onSelectDate={(d) => {
              setSelectedDate(d);
              setViewMode('day');
            }}
            onSelectSlot={handleSelectSlot}
            onSelectBooking={handleSelectBooking}
          />
        )}

        {viewMode === 'day' && (
          <CalendarDayView
            selectedDate={selectedDate}
            slots={proSlots}
            blocks={proBlocks}
            bookings={proBookings}
            onSelectSlot={handleSelectSlot}
            onSelectBooking={handleSelectBooking}
            onAddSlot={() => setIsSlotModalOpen(true)}
            onDuplicateSlot={(s) => duplicateAvailabilitySlot(s.id)}
            onDeleteSlot={(sId) => deleteAvailabilitySlot(sId)}
            onChangeDate={handleDateChangeDelta}
            onOpenChat={handleOpenChat}
          />
        )}
      </div>

      {/* Booking & Slot Inspector Drawer */}
      <BookingDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedSlot(null);
          setSelectedBooking(null);
        }}
        slot={selectedSlot}
        booking={selectedBooking}
        onOpenChat={handleOpenChat}
        onUpdateStatus={updateBookingStatus}
      />

      {/* Modal: Create Slot */}
      <AvailabilitySlotForm
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
        professionalId={proId}
        services={proServices}
        defaultDate={selectedDate}
        onSaveSlot={(slotData) => {
          addAvailabilitySlot(slotData);
          setIsSlotModalOpen(false);
        }}
        onSaveRecurring={(config) => {
          createRecurringSlots(config);
          setIsSlotModalOpen(false);
        }}
      />

      {/* Modal: Block Dates */}
      <AvailabilityBlockForm
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        professionalId={proId}
        onSaveBlock={(blockData) => {
          addAvailabilityBlock(blockData);
          setIsBlockModalOpen(false);
        }}
      />
    </div>
  );
};
