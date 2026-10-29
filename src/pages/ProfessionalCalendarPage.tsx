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

  // View mode
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Currently focused date
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Selected item for drawer
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modals
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  // Navigation handlers
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
    const matchedSlot = proSlots.find((s) => s.id === booking.slotId) || null;
    setSelectedSlot(matchedSlot);
    setIsDrawerOpen(true);
  };

  // Open chat for a booking
  const handleOpenChat = (booking: Booking) => {
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
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      {/* Top Bar with Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4 bg-surface-card p-4 sm:p-5 rounded-2xl border border-border shadow-subtle">
        {/* Navigation & Title */}
        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5 sm:gap-3">
          <div className="flex items-center gap-1 border border-border rounded-lg bg-surface p-0.5 shrink-0">
            <button
              onClick={handlePrev}
              className="p-1.5 hover:bg-sand/40 rounded text-charcoal transition-colors active:scale-95"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-semibold text-charcoal hover:bg-sand/40 rounded transition-colors active:scale-95"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 hover:bg-sand/40 rounded text-charcoal transition-colors active:scale-95"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h1 className="text-base sm:text-lg md:text-xl font-bold text-charcoal flex items-center gap-2 truncate">
            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-wine shrink-0" />
            <span className="truncate">{formattedHeaderTitle}</span>
          </h1>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex items-center justify-between md:justify-end gap-2 flex-wrap">
          {/* View Mode Pills */}
          <div className="flex items-center border border-border rounded-lg bg-sand/30 p-0.5 text-xs font-semibold shrink-0">
            <button
              onClick={() => setViewMode('month')}
              className={`px-2.5 sm:px-3 py-1.5 rounded transition-all active:scale-95 ${
                viewMode === 'month'
                  ? 'bg-wine text-white shadow-xs font-bold'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-2.5 sm:px-3 py-1.5 rounded transition-all active:scale-95 ${
                viewMode === 'week'
                  ? 'bg-wine text-white shadow-xs font-bold'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-2.5 sm:px-3 py-1.5 rounded transition-all active:scale-95 ${
                viewMode === 'day'
                  ? 'bg-wine text-white shadow-xs font-bold'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Day
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Block Dates Button */}
            <button
              onClick={() => setIsBlockModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border border-red-300 text-red-800 bg-red-50/60 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors active:scale-95"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Block Dates</span>
            </button>

            {/* Add Slot Button */}
            <button
              onClick={() => setIsSlotModalOpen(true)}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-wine text-white rounded-lg text-xs font-semibold hover:bg-wine-deep transition-colors shadow-subtle active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Slot</span>
            </button>
          </div>
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
            onDuplicateSlot={(slot) => duplicateAvailabilitySlot(slot.id)}
            onDeleteSlot={(slotId) => deleteAvailabilitySlot(slotId)}
            onChangeDate={handleDateChangeDelta}
            onOpenChat={handleOpenChat}
          />
        )}
      </div>

      {/* Slide-over Drawer for Booking / Slot Details */}
      <BookingDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        booking={selectedBooking}
        slot={selectedSlot}
        onOpenChat={(b) => {
          setIsDrawerOpen(false);
          handleOpenChat(b);
        }}
        onUpdateStatus={(bookingId, status) => {
          updateBookingStatus(bookingId, status);
        }}
      />

      {/* Slot Modal */}
      <AvailabilitySlotForm
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
        professionalId={proId}
        services={proServices}
        defaultDate={selectedDate}
        onSaveSlot={(slot) => {
          addAvailabilitySlot(slot);
          setIsSlotModalOpen(false);
        }}
        onSaveRecurring={(config) => {
          createRecurringSlots(config);
          setIsSlotModalOpen(false);
        }}
      />

      {/* Block Dates Modal */}
      <AvailabilityBlockForm
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        professionalId={proId}
        onSaveBlock={(block) => {
          addAvailabilityBlock(block);
          setIsBlockModalOpen(false);
        }}
      />
    </div>
  );
};
