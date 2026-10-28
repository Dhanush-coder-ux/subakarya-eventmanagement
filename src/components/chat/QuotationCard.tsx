import React from 'react';
import { CheckCircle2, XCircle, FileText, Calendar, IndianRupee, ShieldCheck } from 'lucide-react';
import { Quotation, Role } from '../../types';
import { formatINR, formatDate } from '../../utils';

interface QuotationCardProps {
  quotation: Quotation;
  userRole: Role;
  onAccept?: (quoteId: string) => void;
  onDecline?: (quoteId: string) => void;
}

export const QuotationCard: React.FC<QuotationCardProps> = ({
  quotation,
  userRole,
  onAccept,
  onDecline,
}) => {
  const isPendingResponse = quotation.status === 'sent';
  const isAccepted = quotation.status === 'accepted';
  const isDeclined = quotation.status === 'declined';
  const isCustomer = userRole === 'customer';

  return (
    <div className="bg-surface-card rounded-2xl border border-border shadow-elevated p-4 sm:p-5 w-full max-w-md sm:max-w-lg my-2.5 text-charcoal transition-all">
      {/* Invoice Header */}
      <div className="flex items-start justify-between pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-wine text-white flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-charcoal">Official Service Quotation</h4>
              <p className="text-[11px] text-charcoal-muted">Ref #{quotation.id.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {isAccepted && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-success-light text-success border border-success/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Quote Accepted</span>
            </span>
          )}
          {isDeclined && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-error-light text-error border border-error/30">
              <XCircle className="w-3.5 h-3.5" />
              <span>Declined</span>
            </span>
          )}
          {isPendingResponse && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sand text-charcoal border border-sand-dark">
              <span>Awaiting Response</span>
            </span>
          )}
        </div>
      </div>

      {/* Parties Info */}
      <div className="grid grid-cols-2 gap-3 py-3 text-xs border-b border-border/60">
        <div>
          <span className="text-[10px] uppercase font-bold text-charcoal-light block">Issued By</span>
          <p className="font-semibold text-charcoal">{quotation.professionalName}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-charcoal-light block">Issued To</span>
          <p className="font-semibold text-charcoal">{quotation.customerName}</p>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="py-3">
        <span className="text-[11px] uppercase tracking-wider font-bold text-charcoal-muted block mb-2">
          Itemized Deliverables & Pricing
        </span>
        <div className="space-y-2">
          {quotation.items.map((item, index) => (
            <div
              key={item.id || index}
              className="p-2.5 rounded-xl bg-surface-muted border border-border/70 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-charcoal truncate">{item.title}</p>
                {item.description && (
                  <p className="text-[11px] text-charcoal-muted line-clamp-1">{item.description}</p>
                )}
                <div className="mt-1 text-[11px] text-charcoal-light flex items-center gap-2">
                  <span>Qty: {item.quantity}</span>
                  <span>•</span>
                  <span>{formatINR(item.unitPrice)} each</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="font-bold text-charcoal">{formatINR(item.totalPrice)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="pt-3 pb-2 border-t border-border/80 space-y-1.5 text-xs">
        <div className="flex justify-between text-charcoal-muted">
          <span>Subtotal</span>
          <span className="font-medium text-charcoal">{formatINR(quotation.subtotal)}</span>
        </div>
        {Boolean(quotation.discount) && (
          <div className="flex justify-between text-charcoal-muted">
            <span>Special Promotional Discount</span>
            <span className="font-medium text-success">-{formatINR(quotation.discount)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-border/80 text-sm font-bold text-charcoal">
          <span>Total Quotation Amount</span>
          <span className="text-base text-wine font-bold font-bold">
            {formatINR(quotation.totalAmount)}
          </span>
        </div>
      </div>

      {/* Validity and Notes */}
      <div className="my-3 p-2.5 bg-sand/30 rounded-xl border border-sand-dark/40 text-[11px] text-charcoal-muted space-y-1">
        <div className="flex items-center gap-1.5 font-medium text-charcoal">
          <Calendar className="w-3.5 h-3.5 text-wine" />
          <span>Valid Until: {formatDate(quotation.validUntil)}</span>
        </div>
        {quotation.notes && <p className="italic">{quotation.notes}</p>}
      </div>

      {/* Customer Action Controls */}
      {isCustomer && isPendingResponse && (
        <div className="pt-3 border-t border-border flex items-center gap-2.5">
          <button
            onClick={() => onAccept && onAccept(quotation.id)}
            className="flex-1 py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold tracking-wider transition-all duration-150 shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Accept Quotation & Confirm Booking</span>
          </button>
          <button
            onClick={() => onDecline && onDecline(quotation.id)}
            className="px-4 py-2.5 rounded-xl border border-border hover:bg-sand/40 text-charcoal-muted hover:text-charcoal text-xs font-semibold transition-all active:scale-95"
          >
            Decline
          </button>
        </div>
      )}

      {/* Confirmation indicator */}
      {isAccepted && (
        <div className="mt-3 p-3 bg-success-light/80 rounded-xl border border-success/30 flex items-center gap-2.5 text-success text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>Quotation Accepted. Event date is locked on the schedule!</span>
        </div>
      )}
    </div>
  );
};
