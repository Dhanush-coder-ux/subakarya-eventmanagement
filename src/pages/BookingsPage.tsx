import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CalendarCheck,
  Calendar,
  MapPin,
  Clock,
  IndianRupee,
  CheckCircle2,
  XCircle,
  FileText,
  MessageSquare,
  Filter,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { BookingStatus, Booking } from '../types';
import { formatINR, formatDate } from '../utils';

export const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, accountType } = useAuthStore();
  const { bookings, updateBookingStatus, setActiveConversation, conversations } = useMarketplaceStore();

  const isCustomer = accountType === 'customer';
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filter bookings based on role
  const relevantBookings = bookings.filter((b) =>
    isCustomer ? b.customerId === currentUser.id : b.professionalId === currentUser.id
  );

  const filteredBookings = relevantBookings.filter((b) => {
    if (selectedStatus !== 'all' && b.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const handleOpenChat = (booking: Booking) => {
    // Find conversation corresponding to this booking
    const matchedConv = conversations.find(
      (c) =>
        c.bookingId === booking.id ||
        (c.customerId === booking.customerId && c.professionalId === booking.professionalId)
    );
    if (matchedConv) {
      setActiveConversation(matchedConv.id);
    }
    navigate('/chat');
  };

  const handleMarkComplete = (bookingId: string) => {
    updateBookingStatus(bookingId, 'completed');
  };

  const handleCancelBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="bg-surface-card rounded-2xl border border-border p-4 sm:p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-wine bg-sand/60 px-2 py-0.5 rounded">
            {isCustomer ? 'Customer Reservations' : 'Vendor Booking Pipeline'}
          </span>
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-charcoal mt-1">
            {isCustomer ? 'My Event Bookings' : 'Client Event Schedule & Jobs'}
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5 leading-relaxed">
            {isCustomer
              ? 'Track your event enquiries, review formal quotations, and view confirmed venue dates'
              : 'Manage customer enquiries, send quotations, and track job delivery statuses'}
          </p>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 shrink-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'quote_received', label: isCustomer ? 'Quotes Received' : 'Quotes Sent' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'completed', label: 'Completed' },
          ].map((statusTab) => (
            <button
              key={statusTab.id}
              onClick={() => setSelectedStatus(statusTab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 active:scale-95 ${
                selectedStatus === statusTab.id
                  ? 'bg-wine text-white shadow-xs font-bold'
                  : 'bg-surface text-charcoal-muted hover:bg-sand/30 border border-border'
              }`}
            >
              {statusTab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-3.5 sm:space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-surface-card rounded-2xl border border-border p-8 sm:p-12 text-center text-charcoal-muted">
            <CalendarCheck className="w-10 h-10 text-charcoal-light mx-auto mb-3" />
            <h3 className="font-bold text-charcoal text-base">No Event Bookings Found</h3>
            <p className="text-xs max-w-sm mx-auto mt-1 leading-relaxed">
              {isCustomer
                ? 'Discover event professionals and request quotes to view your upcoming bookings here.'
                : 'Share your business profile to receive customer event booking enquiries.'}
            </p>
            {isCustomer && (
              <Link
                to="/"
                className="mt-4 inline-block px-5 py-2 rounded-xl bg-wine text-white text-xs font-bold active:scale-95 shadow-xs"
              >
                Explore Marketplace
              </Link>
            )}
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const isConfirmed = booking.status === 'confirmed';
            const isQuoteReceived = booking.status === 'quote_received';
            const isPending = booking.status === 'pending';
            const isCompleted = booking.status === 'completed';

            const otherPartyName = isCustomer ? booking.professionalName : booking.customerName;
            const otherPartyAvatar = isCustomer
              ? booking.professionalAvatar
              : booking.customerAvatar;
            const otherPartySubtitle = isCustomer
              ? booking.professionalCategory
              : booking.customerPhone;

            return (
              <div
                key={booking.id}
                className="bg-surface-card rounded-2xl border border-border p-4 sm:p-5 shadow-card hover:border-wine/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Booking Details */}
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                  <img
                    src={otherPartyAvatar}
                    alt={otherPartyName}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-sand shrink-0"
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base text-charcoal truncate">
                        {otherPartyName}
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                          isConfirmed
                            ? 'bg-success-light text-success border border-success/30'
                            : isQuoteReceived
                            ? 'bg-sand text-charcoal border border-sand-dark'
                            : isCompleted
                            ? 'bg-charcoal/10 text-charcoal'
                            : 'bg-wine-soft text-wine border border-wine/20'
                        }`}
                      >
                        {booking.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-charcoal font-medium truncate">{booking.eventType}</p>

                    <div className="flex items-center gap-2 sm:gap-3 text-xs text-charcoal-muted flex-wrap">
                      <span className="flex items-center gap-1 shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-wine shrink-0" />
                        <span>{formatDate(booking.eventDate)}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 shrink-0 truncate max-w-[150px] sm:max-w-none">
                        <MapPin className="w-3.5 h-3.5 text-wine shrink-0" />
                        <span className="truncate">{booking.location}</span>
                      </span>
                      {Boolean(booking.guestCount) && (
                        <>
                          <span>•</span>
                          <span className="shrink-0">{booking.guestCount} Guests</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Financial & Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between md:justify-end gap-3 sm:gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-border/60 shrink-0">
                  <div className="flex items-center justify-between sm:flex-col sm:items-end text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-charcoal-muted block">
                      Booking Value
                    </span>
                    <span className="font-bold text-sm sm:text-base md:text-lg text-wine">
                      {booking.totalAmount ? formatINR(booking.totalAmount) : 'Pending Quote'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleOpenChat(booking)}
                      className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-surface border border-border hover:bg-sand/30 text-charcoal text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-wine" />
                      <span>Chat</span>
                    </button>

                    {!isCustomer && isConfirmed && (
                      <button
                        onClick={() => handleMarkComplete(booking.id)}
                        className="px-3 py-2 rounded-xl bg-success text-white text-xs font-semibold hover:bg-success-dark flex items-center justify-center gap-1 active:scale-95 shrink-0"
                        title="Mark Completed"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Complete</span>
                      </button>
                    )}

                    {!isCompleted && booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="p-2 rounded-xl hover:bg-error-light text-charcoal-light hover:text-error transition-colors shrink-0 active:scale-95"
                        title="Cancel Booking"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
