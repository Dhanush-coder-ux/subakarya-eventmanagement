import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CalendarCheck,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Search,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';
import { Booking, BookingStatus } from '../../../types';
import { formatINR, formatDate } from '../../../utils';

export const BookingManagementSection: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, accountType } = useAuthStore();
  const { bookings, updateBookingStatus, setActiveConversation, conversations } = useMarketplaceStore();

  const isCustomer = accountType === 'customer';
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter bookings based on role
  const relevantBookings = bookings.filter((b) =>
    isCustomer ? b.customerId === currentUser.id : b.professionalId === currentUser.id
  );

  const filteredBookings = relevantBookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.eventType.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        (isCustomer ? b.professionalName.toLowerCase().includes(q) : b.customerName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenChat = (booking: Booking) => {
    const matched = conversations.find(
      (c) =>
        c.bookingId === booking.id ||
        (c.customerId === booking.customerId && c.professionalId === booking.professionalId)
    );
    if (matched) {
      setActiveConversation(matched.id);
    }
    navigate('/chat');
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sand text-charcoal border border-sand-dark">Pending Enquiry</span>;
      case 'quote_received':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-wine-soft text-wine border border-wine/20">Quote Issued</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-success-light text-success border border-success/30">Confirmed Job</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sand text-charcoal border border-sand-dark">Completed</span>;
      case 'cancelled':
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-error-light text-error border border-error/30">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-muted text-charcoal-muted border border-border">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-charcoal">
            {isCustomer ? 'My Bookings' : 'Booking Management'}
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            {isCustomer
              ? 'Review requested dates, pending quotations, confirmed venues, and completed events'
              : 'Manage incoming client leads, issue estimates, confirm job slots, and mark completed jobs'}
          </p>
        </div>

        <Link
          to="/bookings"
          className="px-3.5 py-1.5 rounded-xl border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <span>Open Full Pipeline</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-card rounded-2xl border border-border p-3 sm:p-4 shadow-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['all', 'pending', 'quote_received', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-wine text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/30'
              }`}
            >
              {st === 'quote_received' ? 'Quotes' : st}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-charcoal-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookings..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-border bg-surface text-charcoal placeholder:text-charcoal-muted/70 outline-none focus:border-wine"
          />
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-surface-card rounded-2xl border border-border p-12 text-center space-y-3 shadow-card">
          <div className="w-12 h-12 rounded-full bg-sand text-wine flex items-center justify-center mx-auto">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-charcoal">No Bookings Found</h4>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              {isCustomer
                ? 'You have not submitted any event inquiries or booking reservations yet.'
                : 'No client event requests match the chosen status.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-surface-card rounded-2xl border border-border p-4 sm:p-5 shadow-card space-y-4 hover:border-wine/30 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={isCustomer ? b.professionalAvatar : b.customerAvatar}
                    alt=""
                    className="w-11 h-11 rounded-full object-cover ring-1 ring-border shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-charcoal truncate">
                      {isCustomer ? b.professionalName : b.customerName}
                    </h4>
                    <p className="text-xs text-charcoal-muted truncate">
                      {b.eventType} • {b.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {getStatusBadge(b.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-surface border border-border">
                  <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Event Date</span>
                  <p className="font-semibold text-charcoal mt-0.5">{b.eventDate}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-border">
                  <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Guest Count</span>
                  <p className="font-semibold text-charcoal mt-0.5">{b.guestCount || 'Not specified'}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-border">
                  <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Total Amount</span>
                  <p className="font-bold text-wine mt-0.5">{b.totalAmount ? formatINR(b.totalAmount) : 'Pending Quote'}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-border">
                  <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Reference ID</span>
                  <p className="font-mono text-charcoal mt-0.5 uppercase">#{b.id}</p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => handleOpenChat(b)}
                  className="px-3.5 py-1.5 rounded-xl bg-sand hover:bg-sand-dark text-charcoal text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-wine" />
                  <span>Discussion & Quotation</span>
                </button>

                <div className="flex items-center gap-2">
                  {!isCustomer && b.status === 'confirmed' && (
                    <button
                      type="button"
                      onClick={() => updateBookingStatus(b.id, 'completed')}
                      className="px-3 py-1.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-semibold shadow-xs"
                    >
                      Mark Job Complete
                    </button>
                  )}

                  {(b.status === 'pending' || b.status === 'quote_received') && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Cancel this booking enquiry?')) {
                          updateBookingStatus(b.id, 'cancelled');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl border border-border hover:bg-error-light hover:text-error text-charcoal-muted text-xs font-semibold transition-colors"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

