import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, IndianRupee, Sparkles, Send, Calendar } from 'lucide-react';
import { Quotation, QuoteItem, ServiceItem, InventoryItem, BookingRequestData } from '../../types';
import { formatINR, calculateServiceCost } from '../../utils';

interface CreateQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendQuote: (quote: Quotation) => void;
  professionalId: string;
  professionalName: string;
  customerId: string;
  customerName: string;
  bookingId: string;
  services: ServiceItem[];
  inventory?: InventoryItem[];
  bookingRequest?: BookingRequestData;
}

export const CreateQuoteModal: React.FC<CreateQuoteModalProps> = ({
  isOpen,
  onClose,
  onSendQuote,
  professionalId,
  professionalName,
  customerId,
  customerName,
  bookingId,
  services,
  inventory = [],
  bookingRequest,
}) => {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [validUntil, setValidUntil] = useState<string>(
    new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>(
    'Includes on-site professional team, all equipment, and insurance. 30% advance required upon confirmation.'
  );

  // Pre-populate quotation items when modal opens or bookingRequest is present
  useEffect(() => {
    if (!isOpen) return;

    const initialItems: QuoteItem[] = [];
    const requestedServiceIds = bookingRequest?.selectedServiceIds || [];
    const guestCount = bookingRequest?.guestCount || 100;

    // Add requested services
    services.forEach((srv) => {
      if (requestedServiceIds.includes(srv.id)) {
        const qty = srv.pricingModel === 'per_person' ? guestCount : 1;
        const total = calculateServiceCost(srv, 1, guestCount);
        initialItems.push({
          id: `qi-${Date.now()}-${srv.id}`,
          title: srv.name,
          description: srv.description,
          quantity: qty,
          unitPrice: srv.basePrice,
          pricingModel: srv.pricingModel,
          totalPrice: total,
        });
      }
    });

    // If none requested, add the professional's first active service as a starter
    if (initialItems.length === 0 && services.length > 0) {
      const firstSrv = services[0];
      initialItems.push({
        id: `qi-${Date.now()}-0`,
        title: firstSrv.name,
        description: firstSrv.description,
        quantity: 1,
        unitPrice: firstSrv.basePrice,
        pricingModel: firstSrv.pricingModel,
        totalPrice: firstSrv.basePrice,
      });
    }

    setItems(initialItems);
  }, [isOpen, bookingRequest, services]);

  if (!isOpen) return null;

  const handleAddItemFromService = (service: ServiceItem) => {
    const guestCount = bookingRequest?.guestCount || 100;
    const qty = service.pricingModel === 'per_person' ? guestCount : 1;
    const total = calculateServiceCost(service, 1, guestCount);

    setItems((prev) => [
      ...prev,
      {
        id: `qi-${Date.now()}-${Math.random()}`,
        title: service.name,
        description: service.description,
        quantity: qty,
        unitPrice: service.basePrice,
        pricingModel: service.pricingModel,
        totalPrice: total,
      },
    ]);
  };

  const handleUpdateItemQty = (id: string, newQty: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const validQty = Math.max(1, newQty);
          return {
            ...item,
            quantity: validQty,
            totalPrice: item.unitPrice * validQty,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalAmount = Math.max(0, subtotal - discount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const newQuotation: Quotation = {
      id: `quote-${Date.now()}`,
      bookingId,
      professionalId,
      professionalName,
      customerId,
      customerName,
      items,
      subtotal,
      discount,
      totalAmount,
      validUntil,
      notes,
      status: 'sent',
      createdAt: new Date().toISOString(),
    };

    onSendQuote(newQuotation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-card rounded-2xl border border-border shadow-elevated w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-wine text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-charcoal">
                Create Formal Quotation Card
              </h3>
              <p className="text-xs text-charcoal-muted">
                Precalculated for {customerName} based on configured pricing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-sand/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Service items selection dropdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                Services & Deliverables
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-charcoal-muted">Quick add service:</span>
                <select
                  onChange={(e) => {
                    const found = services.find((s) => s.id === e.target.value);
                    if (found) handleAddItemFromService(found);
                    e.target.value = '';
                  }}
                  defaultValue=""
                  className="text-xs py-1 px-2 rounded-lg border border-border bg-surface text-charcoal focus:outline-none focus:border-wine"
                >
                  <option value="" disabled>
                    + Select package to add
                  </option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({formatINR(s.basePrice)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Current Itemized Lines */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {items.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-border rounded-xl text-xs text-charcoal-muted">
                  No line items added yet. Select a service package above.
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-surface-muted border border-border flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-charcoal truncate">{item.title}</p>
                      <p className="text-[11px] text-charcoal-muted line-clamp-1">{item.description}</p>
                      <span className="text-[10px] text-wine font-medium">
                        Model: {item.pricingModel} ({formatINR(item.unitPrice)} unit price)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-charcoal-muted">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItemQty(item.id, Number(e.target.value))}
                          className="w-16 px-2 py-1 text-xs text-center border border-border rounded-md bg-surface font-semibold"
                        />
                      </div>
                      <span className="font-bold text-charcoal w-20 text-right">
                        {formatINR(item.totalPrice)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 text-charcoal-light hover:text-error transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pricing Summary Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-sand/30 rounded-xl border border-sand-dark/50 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-charcoal block mb-1">
                Promotional Discount (INR)
              </label>
              <input
                type="number"
                min="0"
                max={subtotal}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-charcoal focus:border-wine outline-none font-semibold"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-charcoal block mb-1">
                Quotation Validity Expiry
              </label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-charcoal focus:border-wine outline-none"
              />
            </div>
          </div>

          {/* Terms / Notes */}
          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1">
              Payment Milestones & Validity Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface focus:border-wine outline-none"
            />
          </div>

          {/* Subtotal & Total Preview */}
          <div className="p-3 bg-surface rounded-xl border border-border space-y-1 text-xs">
            <div className="flex justify-between text-charcoal-muted">
              <span>Subtotal:</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount Applied:</span>
                <span>-{formatINR(discount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-border font-bold text-sm text-charcoal">
              <span>Final Proposal Total:</span>
              <span className="text-wine font-bold text-base font-bold">
                {formatINR(totalAmount)}
              </span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border hover:bg-sand/40 text-xs font-semibold text-charcoal transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={items.length === 0}
              className="px-5 py-2.5 rounded-xl bg-wine hover:bg-wine-dark disabled:opacity-50 text-white text-xs font-bold tracking-wider transition-all duration-150 shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Quotation Card</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
