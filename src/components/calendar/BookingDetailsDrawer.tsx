import React from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  IndianRupee,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Booking, AvailabilitySlot } from '../../types';
import { formatINR, formatDate } from '../../utils';

interface BookingDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: Booking | null;
  slot?: AvailabilitySlot | null;
  onOpenChat: (booking: Booking) => void;
  onUpdateStatus?: (bookingId: string, status: any) => void;
}

export const BookingDetailsDrawer: React.FC<BookingDetailsDrawerProps> = ({
  isOpen,
  onClose,
  booking,
  slot,
  onOpenChat,
  onUpdateStatus,
}) => {
  if (!isOpen || (!booking && !slot)) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end p-4 sm:p-0 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-card border-l border-border shadow-elevated w-full max-w-md h-full max-h-[90vh] sm:max-h-full sm:h-full p-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-wine bg-sand/60 px-2 py-0.5 rounded">
                {booking ? 'Event Booking File' : 'Availability Slot'}
              </span>
              <h3 className="font-bold text-base text-charcoal mt-1">
                {booking ? booking.eventType : slot?.title}
              </h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-charcoal-muted hover:text-charcoal">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Booking Info Card if booking exists */}
          {booking && (
            <div className="space-y-4 text-xs">
              {/* Customer Profile */}
              <div className="flex items-center gap-3 p-3 bg-surface-muted rounded-xl border border-border">
                <img
                  src={booking.customerAvatar}
                  alt={booking.customerName}
                  className="w-11 h-11 rounded-full object-cover ring-1 ring-border"
                />
                <div>
                  <h4 className="font-bold text-charcoal">{booking.customerName}</h4>
                  <p className="text-[11px] text-charcoal-muted">{booking.customerPhone}</p>
                  <span className="text-[10px] text-charcoal-light">Customer ID: {booking.customerId}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between py-1">
                <span className="text-charcoal-muted font-medium">Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    booking.status === 'confirmed'
                      ? 'bg-success-light text-success border border-success/30'
                      : booking.status === 'quote_received'
                      ? 'bg-sand text-charcoal border border-sand-dark'
                      : 'bg-wine-soft text-wine border border-wine/20'
                  }`}
                >
                  {booking.status.replace('_', ' ')}
                </span>
              </div>

              {/* Event Specs */}
              <div className="space-y-2 p-3.5 bg-sand/20 rounded-xl border border-sand-dark/50">
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-muted flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-wine" />
                    <span>Date:</span>
                  </span>
                  <span className="font-bold text-charcoal">{formatDate(booking.eventDate)}</span>
                </div>

                {(booking.startTime || slot?.startTime) && (
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-muted flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-wine" />
                      <span>Timing:</span>
                    </span>
                    <span className="font-bold text-charcoal">
                      {booking.startTime || slot?.startTime} – {booking.endTime || slot?.endTime}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-charcoal-muted flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-wine" />
                    <span>Venue:</span>
                  </span>
                  <span className="font-semibold text-charcoal text-right">{booking.location}</span>
                </div>

                {Boolean(booking.guestCount) && (
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-muted flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-wine" />
                      <span>Guests:</span>
                    </span>
                    <span className="font-semibold text-charcoal">{booking.guestCount} Attendees</span>
                  </div>
                )}
              </div>

              {/* Financials */}
              <div className="p-3 bg-surface-muted rounded-xl border border-border flex items-center justify-between">
                <span className="text-charcoal-muted">Quotation / Total:</span>
                <span className="font-bold text-sm text-wine">
                  {booking.totalAmount ? formatINR(booking.totalAmount) : 'Pending Quote'}
                </span>
              </div>
            </div>
          )}

          {/* Slot Capacity details if slot is selected */}
          {slot && (
            <div className="space-y-3 text-xs p-3.5 bg-surface-muted rounded-xl border border-border">
              <span className="font-bold text-charcoal block">Slot Allocation Overview</span>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Total Slot Capacity:</span>
                <span className="font-bold text-charcoal">{slot.capacity} bookings</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Confirmed Allocations:</span>
                <span className="font-bold text-success">{slot.confirmedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Remaining Openings:</span>
                <span className="font-bold text-wine">{Math.max(0, slot.capacity - slot.confirmedCount)}</span>
              </div>
              {slot.notes && (
                <p className="text-[11px] text-charcoal-muted pt-1 border-t border-border/60">
                  {slot.notes}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-border space-y-2">
          {booking && (
            <button
              onClick={() => onOpenChat(booking)}
              className="w-full py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Open Booking Conversation in Chat</span>
            </button>
          )}

          {booking && booking.status === 'confirmed' && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus(booking.id, 'completed')}
              className="w-full py-2 rounded-xl bg-success text-white text-xs font-semibold hover:bg-success-dark flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Job Completed</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
